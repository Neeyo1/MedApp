using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [StringLength(12, MinimumLength = 4)]
    public required string Username { get; set; }

    [Required]
    [StringLength(12, MinimumLength = 8)]
    public required string Password { get; set; }

    [Required]
    public required string FirstName { get; set; }

    [Required]
    public required string LastName { get; set; }
    
    [Required]
    public required int BirthYear { get; set; }

    [Required]
    public required int BirthMonth { get; set; }

    [Required]
    public required int BirthDay { get; set; }
}
