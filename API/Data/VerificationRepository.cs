using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class VerificationRepository(DataContext context, IMapper mapper) : IVerificationRepository
{
    public void AddVerification(Verification verification)
    {
        context.Verifications.Add(verification);
    }
    public void DeleteVerification(Verification verification)
    {
        context.Verifications.Remove(verification);
    }
    public async Task<Verification?> GetVerificationByIdAsync(int verificationId)
    {
        return await context.Verifications
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == verificationId);
    }

    public async Task<Verification?> GetVerificationByUserIdAsync(int userId)
    {
        return await context.Verifications
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }

    public async Task<IEnumerable<VerificationDto>> GetVerificationsAsync()
    {
        return await context.Verifications
            .ProjectTo<VerificationDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
