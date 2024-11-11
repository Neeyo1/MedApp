using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IOfficeRepository
{
    void AddOffice(Office office);
    void DeleteOffice(Office office);
    Task<Office?> GetOfficeByIdAsync(int officeId);
    Task<Office?> GetOfficeByOfficeNameAsync(string officeName);
    Task<PagedList<OfficeDto>> GetOfficesAsync(OfficeParams officeParams);
    Task<PagedList<OfficeDto>> GetAllOfficesAsync(OfficeParams officeParams);
    Task<bool> Complete();
}
