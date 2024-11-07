using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IResultRepository
{
    void AddResult(Result result);
    void DeleteResult(Result result);
    Task<Result?> GetResultByIdAsync(int resultId);
    Task<IEnumerable<ResultDto>> GetAllResultsAsDoctorAsync(int doctorId);
    Task<IEnumerable<ResultDto>> GetResultsForPatientAsDoctorAsync(int doctorId, int patientId);
    Task<IEnumerable<ResultDto>> GetAllResultsAsPatientAsync(int patientId);
    Task<bool> Complete();
}
