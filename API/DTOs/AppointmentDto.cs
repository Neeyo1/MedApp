namespace API.DTOs;

public class AppointmentDto
{
    public int Id { get; set; }
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public bool IsOpen { get; set; }
}
