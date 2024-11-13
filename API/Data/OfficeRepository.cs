using API.DTOs;
using API.Entities;
using API.Helpers;
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

    public async Task<PagedList<OfficeDto>> GetOfficesAsync(OfficeParams officeParams)
    {
        var query = context.Offices.AsQueryable();

        if (officeParams.DoctorId != 0)
        {
            query = query.Where(x => x.DoctorId == officeParams.DoctorId);
        }

        if (officeParams.City != null)
        {
            query = query.Where(x => x.City == officeParams.City);
        }

        return await PagedList<OfficeDto>.CreateAsync(
            query.ProjectTo<OfficeDto>(mapper.ConfigurationProvider), 
            officeParams.PageNumber, officeParams.PageSize);
    }

    public async Task<PagedList<OfficeDto>> GetAllOfficesAsync(OfficeParams officeParams)
    {
        var query = context.Offices.AsQueryable();

        if (officeParams.City != null)
        {
            query = query.Where(x => x.City == officeParams.City);
        }

        return await PagedList<OfficeDto>.CreateAsync(
            query.ProjectTo<OfficeDto>(mapper.ConfigurationProvider), 
            officeParams.PageNumber, officeParams.PageSize);
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
