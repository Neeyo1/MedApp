using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>,
    IdentityUserToken<int>>(options)
{
    public DbSet<Office> Offices { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Result> Results { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        //AppUser - AppRole
        builder.Entity<AppUser>()
            .HasMany(x => x.UserRoles)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .IsRequired();

        builder.Entity<AppRole>()
            .HasMany(x => x.UserRoles)
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .IsRequired();

        //AppUser - Office (Owner)
        builder.Entity<AppUser>()
            .HasMany(x => x.Offices)
            .WithOne(x => x.Doctor)
            .HasForeignKey(x => x.DoctorId)
            .IsRequired();

        //AppUser - Appointment
        builder.Entity<AppUser>()
            .HasMany(x => x.Appointments)
            .WithOne(x => x.Patient)
            .HasForeignKey(x => x.PatientId)
            .IsRequired(false);

        //Office - Appointment
        builder.Entity<Office>()
            .HasMany(x => x.Appointments)
            .WithOne(x => x.Office)
            .HasForeignKey(x => x.OfficeId)
            .IsRequired();

        //AppUser - Office (Results)
        builder.Entity<Result>().HasKey(x => new {x.PatientId, x.OfficeId});

        builder.Entity<AppUser>()
            .HasMany(x => x.Results)
            .WithOne(x => x.Patient)
            .HasForeignKey(x => x.PatientId)
            .IsRequired();

        builder.Entity<Office>()
            .HasMany(x => x.Results)
            .WithOne(x => x.Office)
            .HasForeignKey(x => x.OfficeId)
            .IsRequired();
    }
}
