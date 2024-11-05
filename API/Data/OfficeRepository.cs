using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class OfficeRepository(DataContext context, IMapper mapper) : IOfficeRepository
{
    public void AddOffice(Office office)
    {
        context.Offices.Add(office);
    }

    public void DeleteOffice(Office office)
    {
        context.Offices.Remove(office);
    }

    public async Task<Office?> GetOfficeByIdAsync(int officeId)
    {
        return await context.Offices
            .FirstOrDefaultAsync(x => x.Id == officeId);
    }

    public async Task<Office?> GetOfficeByOfficeNameAsync(string officeName)
    {
        return await context.Offices
            .SingleOrDefaultAsync(x => x.Name == officeName);
    }

    public async Task<IEnumerable<OfficeDto>> GetOfficesAsync(int userId)
    {
        return await context.Offices
            .Where(x => x.DoctorId == userId)
            .ProjectTo<OfficeDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
