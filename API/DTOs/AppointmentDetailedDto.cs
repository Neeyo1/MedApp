namespace API.DTOs;

public class AppointmentDetailedDto
{
    public int Id { get; set; }
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public bool IsOpen { get; set; }
    public bool HasEnded { get; set; }
    public MemberDto? Patient { get; set; }
    public OfficeDto Office { get; set; } = null!;
}
