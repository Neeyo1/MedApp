using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UserEditPasswordDto
{
    [Required]
    [StringLength(12, MinimumLength = 8)]
    public required string CurrentPassword { get; set; }

    [Required]
    [StringLength(12, MinimumLength = 8)]
    public required string NewPassword { get; set; }
}
