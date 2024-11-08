using API.Entities;

namespace API.DTOs;

public class VerificationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}
