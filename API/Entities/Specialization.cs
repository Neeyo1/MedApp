using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Specializations")]
public class Specialization
{
    public int Id { get; set; }
    public required string Name { get; set; }

    //Specialization - OfficeSpecialization
    public ICollection<OfficeSpecialization> OfficeSpecializations { get; set; } = [];
}
