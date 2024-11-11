using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IResultRepository
{
    void AddResult(Result result);
    void DeleteResult(Result result);
    Task<Result?> GetResultByIdAsync(int resultId);
    Task<PagedList<ResultDto>> GetAllResultsAsDoctorAsync(int doctorId, ResultParams resultParams);
    Task<PagedList<ResultDto>> GetResultsForPatientAsDoctorAsync(int doctorId, int patientId, 
        ResultParams resultParams);
    Task<PagedList<ResultDto>> GetAllResultsAsPatientAsync(int patientId, ResultParams resultParams);
    Task<bool> Complete();
}
