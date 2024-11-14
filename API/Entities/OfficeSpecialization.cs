using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("OfficeSpecializations")]
public class OfficeSpecialization
{
    public int OfficeId { get; set; }
    public Office Office { get; set; } = null!;
    public int SpecializationId { get; set; }
    public Specialization Specialization { get; set; } = null!;
}
