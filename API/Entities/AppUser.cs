using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser<int>
{
    public required string KnownAs { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;

    //AppUser - AppUserRole
    public ICollection<AppUserRole> UserRoles { get; set; } = [];

    //AppUser(Doctor) - Office
    public ICollection<Office> Offices { get; set; } = [];

    //AppUser(Patient) - Appointment
    public ICollection<Appointment> Appointments { get; set; } = [];

    //AppUser(Patient) - Result
    public ICollection<Result> Results { get; set; } = [];
}