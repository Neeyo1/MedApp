namespace API.Helpers;

public class ResultParams : PaginationParams
{
    public string OrderBy { get; set; } = "newest";
}
