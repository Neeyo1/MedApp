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
    IMapper mapper, IUserRepository userRepository, IVerificationRepository verificationRepository,
    IPhotoService photoService) : BaseApiController
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
            .Include(p => p.ProfilePhotos)
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
    
    [Authorize]
    [HttpPost("add-photo")]
    public async Task<ActionResult<ProfilePhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var result = await photoService.AddPhotoAsync(file);
        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new ProfilePhoto
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };
        if (user.ProfilePhotos.Count == 0) photo.IsMain = true;

        user.ProfilePhotos.Add(photo);

        if (await userRepository.Complete()) return mapper.Map<ProfilePhotoDto>(photo);
        return BadRequest("Failed to add photo");
    }

    [Authorize]
    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var photo = user.ProfilePhotos.FirstOrDefault(x => x.Id == photoId);
        if (photo == null || photo.IsMain) return BadRequest("Could not use this as main photo");
        
        var currentMain = user.ProfilePhotos.FirstOrDefault(x => x.IsMain);
        if (currentMain != null) currentMain.IsMain = false;

        photo.IsMain = true;

        if (await userRepository.Complete()) return NoContent();
        return BadRequest("Could not not set main photo");
    }

    [Authorize]
    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var photo = user.ProfilePhotos.FirstOrDefault(x => x.Id == photoId);
        if (photo == null || photo.IsMain) return BadRequest("Could not delete this photo");

        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }

        user.ProfilePhotos.Remove(photo);

        if (await userRepository.Complete()) return NoContent();
        return BadRequest("Could not delete photo");
    }

    private async Task<bool> UserExists(string username)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }
}