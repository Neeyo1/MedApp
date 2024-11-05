using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Offices")]
public class Office
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string City { get; set; }
    public required string Street { get; set; }
    public required string Apartment { get; set; }
    public List<int> MondayHours { get; set; } = [];
    public List<int> TuesdayHours { get; set; } = [];
    public List<int> WednesdayHours { get; set; } = [];
    public List<int> ThursdayHours { get; set; } = [];
    public List<int> FridayHours { get; set; } = [];
    public List<int> SaturdayHours { get; set; } = [];
    public List<int> SundayHours { get; set; } = [];

    //Office - Owner(Doctor)
    public int DoctorId { get; set; }
    public AppUser Doctor { get; set; } = null!;

    //Office - Appointment
    public ICollection<Appointment> Appointments { get; set; } = [];

    //Office - Result
    public ICollection<Result> Results { get; set; } = [];
}
