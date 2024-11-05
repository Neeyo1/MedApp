using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IOfficeRepository
{
    void AddOffice(Office office);
    void DeleteOffice(Office office);
    Task<Office?> GetOfficeByIdAsync(int officeId);
    Task<Office?> GetOfficeByOfficeNameAsync(string officeName);
    Task<IEnumerable<OfficeDto>> GetOfficesAsync(int userId);
    Task<bool> Complete();
}
