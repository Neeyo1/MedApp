using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class ResultsController(IResultRepository resultRepository, IUserRepository userRepository,
    IMapper mapper, UserManager<AppUser> userManager, IOfficeRepository officeRepository)
    : BaseApiController
{
    [Authorize(Policy = "RequireDoctorRole")]
    [HttpGet("doctor")]
    public async Task<ActionResult<PagedList<ResultDto>>> GetAllResultsAsDoctor([FromQuery] ResultParams resultParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var results = await resultRepository.GetAllResultsAsDoctorAsync(user.Id, resultParams);
        Response.AddPaginationHeader(results);
        return Ok(results);
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpGet("doctor/{patientId}")]
    public async Task<ActionResult<PagedList<ResultDto>>> GetResultsForPatientAsDoctor(int patientId,
        [FromQuery] ResultParams resultParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var results = await resultRepository.GetResultsForPatientAsDoctorAsync(user.Id, patientId,
            resultParams);
        Response.AddPaginationHeader(results);
        return Ok(results);
    }

    [Authorize(Policy = "RequirePatientRole")]
    [HttpGet("patient")]
    public async Task<ActionResult<PagedList<ResultDto>>> GetAllResultsAsPatient([FromQuery] ResultParams resultParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var results = await resultRepository.GetAllResultsAsPatientAsync(user.Id, resultParams);
        Response.AddPaginationHeader(results);
        return Ok(results);
    }

    [HttpGet("{resultId}")]
    public async Task<ActionResult<OfficeDto>> GetResult(int resultId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var result = await resultRepository.GetResultByIdAsync(resultId);
        if (result == null) return BadRequest("Result does not exist");

        var roles = await userManager.GetRolesAsync(user);
        if (result.PatientId != user.Id && !roles.Contains("Doctor"))
            return Unauthorized();

        return Ok(mapper.Map<ResultDto>(result));
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpPost]
    public async Task<ActionResult<OfficeDto>> CreateResult(ResultCreateDto resultCreateDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var office = await officeRepository.GetOfficeByIdAsync(resultCreateDto.OfficeId);
        if (office == null) return BadRequest("Office does not exist");
        if (office.DoctorId != user.Id) return Unauthorized();

        var patient = await userRepository.GetUserByIdAsync(resultCreateDto.PatientId);
        if (patient == null) return BadRequest("Could not find patient");

        var result = mapper.Map<Result>(resultCreateDto);

        resultRepository.AddResult(result);

        if (await resultRepository.Complete()) return Ok(mapper.Map<ResultDto>(result));
        return BadRequest("Failed to create result");
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpPut("{resultId}")]
    public async Task<ActionResult<OfficeDto>> EditResult(ResultCreateDto resultEditDto, int resultId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var result = await resultRepository.GetResultByIdAsync(resultId);
        if (result == null) return BadRequest("Could not find result");
        if (result.OfficeId == null) return BadRequest("Could not find office related to this result");

        var office = await officeRepository.GetOfficeByIdAsync((int)result.OfficeId);
        if (office == null) return BadRequest("Office does not exist");
        if (office.DoctorId != user.Id) return Unauthorized();

        mapper.Map(resultEditDto, result);

        if (await resultRepository.Complete()) return Ok(mapper.Map<ResultDto>(result));
        return BadRequest("Failed to edit result");
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpDelete("{resultId}")]
    public async Task<ActionResult> DeleteResult(int resultId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var result = await resultRepository.GetResultByIdAsync(resultId);
        if (result == null) return BadRequest("Could not find result");
        if (result.OfficeId == null) return BadRequest("Could not find office related to this result");

        var office = await officeRepository.GetOfficeByIdAsync((int)result.OfficeId);
        if (office == null) return BadRequest("Office does not exist");
        if (office.DoctorId != user.Id) return Unauthorized();
        
        resultRepository.DeleteResult(result);

        if (await resultRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete result");
    }
}
