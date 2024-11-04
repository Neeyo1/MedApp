using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Appointments")]
public class Appointment
{
    public int Id { get; set; }
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public bool IsOpen { get; set; } = true;
    public bool HasEnded { get; set; } = false;

    //Appointment - User(Patient)
    public int PatientId { get; set; }
    public AppUser Patient { get; set; } = null!;

    //Appointment - Office
    public int OfficeId { get; set; }
    public Office Office { get; set; } = null!;
}
