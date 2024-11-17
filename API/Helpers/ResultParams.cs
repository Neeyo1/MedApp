namespace API.Helpers;

public class ResultParams : PaginationParams
{
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public string OrderBy { get; set; } = "newest";
}
