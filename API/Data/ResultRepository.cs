using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ResultRepository(DataContext context, IMapper mapper) : IResultRepository
{
    public void AddResult(Result result)
    {
        context.Results.Add(result);
    }

    public void DeleteResult(Result result)
    {
        context.Results.Remove(result);
    }

    public async Task<Result?> GetResultByIdAsync(int resultId)
    {
        return await context.Results
            .FindAsync(resultId);
    }

    public async Task<IEnumerable<ResultDto>> GetAllResultsAsDoctorAsync(int doctorId)
    {
        return await context.Results
            .Where(x => x.Office != null && x.Office.DoctorId == doctorId)
            .ProjectTo<ResultDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
    public async Task<IEnumerable<ResultDto>> GetResultsForPatientAsDoctorAsync(int doctorId, int patientId)
    {
        return await context.Results
            .Where(x => x.Office != null && x.Office.DoctorId == doctorId && x.PatientId == patientId)
            .ProjectTo<ResultDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
    public async Task<IEnumerable<ResultDto>> GetAllResultsAsPatientAsync(int patientId)
    {
        return await context.Results
            .Where(x => x.PatientId == patientId)
            .ProjectTo<ResultDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
