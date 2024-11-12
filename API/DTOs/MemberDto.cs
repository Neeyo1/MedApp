namespace API.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? ProfilePhotoUrl { get; set; }
}
