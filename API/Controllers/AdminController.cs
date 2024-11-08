using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireAdminRole")]
public class AdminController(IUserRepository userRepository, UserManager<AppUser> userManager,
    IVerificationRepository verificationRepository) : BaseApiController
{
    [HttpGet("verifications")]
    public async Task<ActionResult<IEnumerable<VerificationDto>>> GetVerifications()
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var results = await verificationRepository.GetVerificationsAsync();
        return Ok(results);
    }

    [HttpPost("verifications/{verificationId}")]
    public async Task<ActionResult<IEnumerable<VerificationDto>>> VerifyDoctor(int verificationId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var verification = await verificationRepository.GetVerificationByIdAsync(verificationId);
        if (verification == null) return BadRequest("Verification does not exist");
        if (verification.User == null) return BadRequest("Could not find user to verify");

        var result = await userManager.AddToRoleAsync(verification.User, "Doctor");
        if (!result.Succeeded) return BadRequest(result.Errors);

        result = await userManager.RemoveFromRoleAsync(verification.User, "Patient");
        if (!result.Succeeded) return BadRequest(result.Errors);

        verificationRepository.DeleteVerification(verification);

        if (await verificationRepository.Complete()) return NoContent();
        return BadRequest("Failed to verify user");
    }
}
