using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Offices")]
public class Office
{
    public int Id { get; set; }
    public required string City { get; set; }
    public required string Street { get; set; }
    public required string Apartment { get; set; }
    public ICollection<int> MondayHours { get; set; } = [];
    public ICollection<int> TuesdayHours { get; set; } = [];
    public ICollection<int> WednesdayHours { get; set; } = [];
    public ICollection<int> ThursdayHours { get; set; } = [];
    public ICollection<int> FridayHours { get; set; } = [];
    public ICollection<int> SaturdayHours { get; set; } = [];
    public ICollection<int> SundayHours { get; set; } = [];

    //Office - Owner(Doctor)
    public int DoctorId { get; set; }
    public AppUser Doctor { get; set; } = null!;

    //Office - Appointment
    public ICollection<Appointment> Appointments { get; set; } = [];

    //Office - Result
    public ICollection<Result> Results { get; set; } = [];
}
