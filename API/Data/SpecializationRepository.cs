using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class SpecializationRepository(DataContext context, IMapper mapper) : ISpecializationRepository
{
    public void AddSpecialization(Specialization specialization)
    {
        context.Specializations.Add(specialization);
    }

    public void DeleteSpecialization(Specialization specialization)
    {
        context.Specializations.Remove(specialization);
    }

    public async Task<Specialization?> GetSpecializationByIdAsync(int specializationId)
    {
        return await context.Specializations
            .FindAsync(specializationId);
    }

    public async Task<Specialization?> GetSpecializationByNameAsync(string specializationName)
    {
        return await context.Specializations
            .FirstOrDefaultAsync(x => x.Name == specializationName);
    }

    public async Task<IEnumerable<SpecializationDto>> GetSpecializationsAsync()
    {
        return await context.Specializations
            .ProjectTo<SpecializationDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<bool> IsSpecializationExisting(string specializationName)
    {
        return await GetSpecializationByNameAsync(specializationName) != null;
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
