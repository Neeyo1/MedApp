namespace API.Helpers;

public class AppointmentParams : PaginationParams
{
    public int OfficeId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public string Status { get; set; } = "all";
    public string OrderBy { get; set; } = "closest";
}
