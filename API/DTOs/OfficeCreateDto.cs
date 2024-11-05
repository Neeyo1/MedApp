using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class OfficeCreateDto
{
    [Required] public required string Name { get; set; }
    [Required] public required string City { get; set; }
    [Required] public required string Street { get; set; }
    [Required] public required string Apartment { get; set; }
    public IEnumerable<int> MondayHours { get; set; } = [];
    public IEnumerable<int> TuesdayHours { get; set; } = [];
    public IEnumerable<int> WednesdayHours { get; set; } = [];
    public IEnumerable<int> ThursdayHours { get; set; } = [];
    public IEnumerable<int> FridayHours { get; set; } = [];
    public IEnumerable<int> SaturdayHours { get; set; } = [];
    public IEnumerable<int> SundayHours { get; set; } = [];
}
