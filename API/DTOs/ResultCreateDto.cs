using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ResultCreateDto
{
    [Required] public required string Name { get; set; }
    [Required] public required string Description { get; set; }
    [Required] public int PatientId { get; set; }
    [Required] public int OfficeId { get; set; }
}
