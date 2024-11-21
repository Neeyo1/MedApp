using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AppointmentCreateDto
{
    [Required]
    [Range(1, 12)]
    public int Month { get; set; }
    [Required]
    public int Year { get; set; }
    [Required] public int OfficeId { get; set; }
}
