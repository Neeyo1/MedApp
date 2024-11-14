using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface ISpecializationRepository
{
    void AddSpecialization(Specialization specialization);
    void DeleteSpecialization(Specialization specialization);
    Task<Specialization?> GetSpecializationByIdAsync(int specializationId);
    Task<Specialization?> GetSpecializationByNameAsync(string specializationName);
    Task<IEnumerable<SpecializationDto>> GetSpecializationsAsync();
    Task<bool> IsSpecializationExisting(string specializationName);
    Task<OfficeSpecialization?> GetOfficeSpecializationByIdAsync(int officeId, int specializationId);
    Task<bool> Complete();
}
