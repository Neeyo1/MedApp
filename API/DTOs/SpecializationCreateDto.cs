using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SpecializationCreateDto
{
    [Required] public required string Name { get; set; }
}
