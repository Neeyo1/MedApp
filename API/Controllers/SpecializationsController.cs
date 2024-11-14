using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class SpecializationsController(IUserRepository userRepository, IMapper mapper,
    ISpecializationRepository specializationRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SpecializationDto>>> GetSpecializations()
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var specializations = await specializationRepository.GetSpecializationsAsync();

        return Ok(specializations);
    }

    [HttpGet("{specializationId}")]
    public async Task<ActionResult<SpecializationDto>> GetSpecialization(int specializationId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var specialization = await specializationRepository.GetSpecializationByIdAsync(specializationId);
        if (specialization == null) return BadRequest("Specialization does not exist");

        var result = mapper.Map<SpecializationDto>(specialization);

        return Ok(result);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult<SpecializationDto>> CreateSpecialization(SpecializationCreateDto specializationCreateDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        if (await specializationRepository.IsSpecializationExisting(specializationCreateDto.Name))
            return BadRequest("Specialization with this name already exists");

        var specialization = mapper.Map<Specialization>(specializationCreateDto);

        specializationRepository.AddSpecialization(specialization);

        if (await specializationRepository.Complete()) 
            return Ok(mapper.Map<SpecializationDto>(specialization));
        return BadRequest("Failed to create specialization");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{specializationId}")]
    public async Task<ActionResult<SpecializationDto>> EditSpecialization(SpecializationCreateDto specializationEditDto, int specializationId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var specialization = await specializationRepository.GetSpecializationByIdAsync(specializationId);
        if (specialization == null) return BadRequest("Could not find specialization");

        mapper.Map(specializationEditDto, specialization);

        if (await specializationRepository.Complete())
            return Ok(mapper.Map<SpecializationDto>(specialization));
        return BadRequest("Failed to edit specialization");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{specializationId}")]
    public async Task<ActionResult> DeleteSpecialization(int specializationId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var specialization = await specializationRepository.GetSpecializationByIdAsync(specializationId);
        if (specialization == null) return BadRequest("Could not find specialization");
        
        specializationRepository.DeleteSpecialization(specialization);

        if (await specializationRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete specialization");
    }
}
