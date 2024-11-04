using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Results")]
public class Result
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Result - User(Patient)
    public int PatientId { get; set; }
    public AppUser Patient { get; set; } = null!;

    //Result - Office
    public int OfficeId { get; set; }
    public Office Office { get; set; } = null!;
}
