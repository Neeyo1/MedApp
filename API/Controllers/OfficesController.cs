using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OfficesController(IOfficeRepository officeRepository, IUserRepository userRepository,
    IMapper mapper, ISpecializationRepository specializationRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<OfficeDto>>> GetOffices([FromQuery] OfficeParams officeParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var offices = await officeRepository.GetOfficesAsync(officeParams);
        Response.AddPaginationHeader(offices);

        return Ok(offices);
    }

    [HttpGet("all")]
    public async Task<ActionResult<PagedList<OfficeDto>>> GetAllOffices([FromQuery] OfficeParams officeParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var offices = await officeRepository.GetAllOfficesAsync(officeParams);
        Response.AddPaginationHeader(offices);

        return Ok(offices);
    }

    [HttpGet("{officeId}")]
    public async Task<ActionResult<OfficeDto>> GetOffice(int officeId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var office = await officeRepository.GetOfficeByIdAsync(officeId);
        if (office == null) return BadRequest("Office does not exist");

        var result = mapper.Map<OfficeDto>(office);

        return Ok(result);
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpPost]
    public async Task<ActionResult<OfficeDto>> CreateOffice(OfficeCreateDto officeCreateDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var office = mapper.Map<Office>(officeCreateDto);
        office.Doctor = user;
        foreach (var specializationId in officeCreateDto.Specializations)
        {
            if (await specializationRepository.GetSpecializationByIdAsync(specializationId) != null)
            {   
                var officeSpecialization = new OfficeSpecialization
                {
                    OfficeId = office.Id,
                    SpecializationId = specializationId
                };
                office.OfficeSpecializations.Add(officeSpecialization);
            }
        }

        officeRepository.AddOffice(office);

        if (await officeRepository.Complete()) return Ok(mapper.Map<OfficeDto>(office));
        return BadRequest("Failed to create office");
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpPut("{officeId}")]
    public async Task<ActionResult<OfficeDto>> EditOffice(OfficeCreateDto officeEditDto, int officeId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var office = await officeRepository.GetOfficeByIdAsync(officeId);
        if (office == null) return BadRequest("Could not find office");

        if (office.DoctorId != user.Id) return Unauthorized();

        mapper.Map(officeEditDto, office);
        var currentSpecializations = office.OfficeSpecializations.Select(x => x.SpecializationId).ToList();
        var specializationsToRemove = currentSpecializations.Except(officeEditDto.Specializations);
        var specializationsToAdd = officeEditDto.Specializations.Except(currentSpecializations);
        foreach (var specializationId in specializationsToRemove)
        {
            var officeSpecialization = await specializationRepository.GetOfficeSpecializationByIdAsync(
                officeId, specializationId);
            
            if (officeSpecialization != null)
            {   
                office.OfficeSpecializations.Remove(officeSpecialization);
            }
        }

        foreach (var specializationId in specializationsToAdd)
        {
            if (await specializationRepository.GetSpecializationByIdAsync(specializationId) != null)
            {   
                var officeSpecialization = new OfficeSpecialization
                {
                    OfficeId = office.Id,
                    SpecializationId = specializationId
                };
                office.OfficeSpecializations.Add(officeSpecialization);
            }
        }

        if (await officeRepository.Complete()) return Ok(mapper.Map<OfficeDto>(office));
        return BadRequest("Failed to edit office");
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpDelete("{officeId}")]
    public async Task<ActionResult> DeleteOffice(int officeId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var office = await officeRepository.GetOfficeByIdAsync(officeId);
        if (office == null) return BadRequest("Could not find office");

        if (office.DoctorId != user.Id) return Unauthorized();
        
        officeRepository.DeleteOffice(office);

        if (await officeRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete office");
    }
}
