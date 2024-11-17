using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IResultRepository
{
    void AddResult(Result result);
    void DeleteResult(Result result);
    Task<Result?> GetResultByIdAsync(int resultId);
    Task<PagedList<ResultDto>> GetResultsAsDoctorAsync(ResultParams resultParams);
    Task<PagedList<ResultDto>> GetResultsAsPatientAsync(ResultParams resultParams);
    Task<bool> Complete();
}
