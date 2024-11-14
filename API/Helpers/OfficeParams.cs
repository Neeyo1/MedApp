namespace API.Helpers;

public class OfficeParams : PaginationParams
{
    public int DoctorId { get; set; }
    public string? City { get; set; }
    public int SpecializationId { get; set; }
}
