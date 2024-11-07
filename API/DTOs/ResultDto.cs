namespace API.DTOs;

public class ResultDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public MemberDto Patient { get; set; } = null!;
    public OfficeDto Office { get; set; } = null!;
}
