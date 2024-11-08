using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Verifications")]
public class Verification
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public AppUser? User { get; set; } = null!;
}
