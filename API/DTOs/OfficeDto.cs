namespace API.DTOs;

public class OfficeDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string City { get; set; }
    public required string Street { get; set; }
    public required string Apartment { get; set; }
    public IEnumerable<int> MondayHours { get; set; } = [];
    public IEnumerable<int> TuesdayHours { get; set; } = [];
    public IEnumerable<int> WednesdayHours { get; set; } = [];
    public IEnumerable<int> ThursdayHours { get; set; } = [];
    public IEnumerable<int> FridayHours { get; set; } = [];
    public IEnumerable<int> SaturdayHours { get; set; } = [];
    public IEnumerable<int> SundayHours { get; set; } = [];
    public MemberDto Doctor { get; set; } = null!;
}
