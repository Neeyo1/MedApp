using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("ProfilePhotos")]
public class ProfilePhoto
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public bool IsMain { get; set; }
    public string? PublicId { get; set; }

    //ProfilePhoto - AppUser
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;
}
