using API.DTOs;
using API.Entities;
using API.Helpers;
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

    public async Task<PagedList<ResultDto>> GetResultsAsDoctorAsync(ResultParams resultParams)
    {
        var query = context.Results.AsQueryable();

        if (resultParams.DoctorId != 0)
        {
            query = query.Where(x => x.Office != null && x.Office.DoctorId == resultParams.DoctorId);
        }

        if (resultParams.PatientId != 0)
        {
            query = query.Where(x => x.PatientId == resultParams.PatientId);
        }

        query = resultParams.OrderBy switch
        {
            "newest" => query.OrderByDescending(x => x.CreatedAt),
            _ => query.OrderBy(x => x.CreatedAt)
        };

        return await PagedList<ResultDto>.CreateAsync(
            query.ProjectTo<ResultDto>(mapper.ConfigurationProvider), 
            resultParams.PageNumber, resultParams.PageSize);
    }
    
    public async Task<PagedList<ResultDto>> GetResultsAsPatientAsync(ResultParams resultParams)
    {
        var query = context.Results.AsQueryable();
        query = query.Where(x => x.PatientId == resultParams.PatientId);

        query = resultParams.OrderBy switch
        {
            "newest" => query.OrderByDescending(x => x.CreatedAt),
            _ => query.OrderBy(x => x.CreatedAt)
        };

        return await PagedList<ResultDto>.CreateAsync(
            query.ProjectTo<ResultDto>(mapper.ConfigurationProvider), 
            resultParams.PageNumber, resultParams.PageSize);
    }
    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
