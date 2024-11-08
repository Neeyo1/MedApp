using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OfficesController(IOfficeRepository officeRepository, IUserRepository userRepository,
    IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OfficeDto>>> GetOffices([FromQuery] int userId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var offices = await officeRepository.GetOfficesAsync(userId);

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
