using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService,
    IMapper mapper, IUserRepository userRepository, IVerificationRepository verificationRepository) 
    : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();
        user.DateOfBirth = new DateOnly(registerDto.BirthYear, registerDto.BirthMonth,
            registerDto.BirthDay);

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);
        await userManager.AddToRoleAsync(user, "User");
        await userManager.AddToRoleAsync(user, "Patient");

        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        return userToReturn;
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.Users
            .SingleOrDefaultAsync(x => x.NormalizedUserName == loginDto.Username.ToUpper());
        if (user == null || user.UserName == null) return BadRequest("Invalid username or password");
        if (!await userManager.CheckPasswordAsync(user, loginDto.Password))
            return BadRequest("Invalid username or password");

        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        return userToReturn;
    }

    [Authorize(Policy = "RequirePatientRole")]
    [HttpPost("verify")]
    public async Task<ActionResult> AskForVerification()
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var userRoles = await userManager.GetRolesAsync(user);
        if (!userRoles.Contains("Patient")) return Unauthorized();

        if (await verificationRepository.GetVerificationByUserIdAsync(user.Id) != null)
            return BadRequest("Your verifications is already in process");

        var verification = new Verification
        {
            User = user
        };
        verificationRepository.AddVerification(verification);

        if (await verificationRepository.Complete()) return NoContent();
        return BadRequest("Failed to add to verification queue");
    }

    private async Task<bool> UserExists(string username)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }
}