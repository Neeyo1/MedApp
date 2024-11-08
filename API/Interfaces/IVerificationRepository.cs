using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IVerificationRepository
{
    void AddVerification(Verification verification);
    void DeleteVerification(Verification verification);
    Task<Verification?> GetVerificationByIdAsync(int verificationId);
    Task<Verification?> GetVerificationByUserIdAsync(int userId);
    Task<IEnumerable<VerificationDto>> GetVerificationsAsync();
    Task<bool> Complete();
}
