using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<AppUser?> GetUserByIdAsync(int userId)
    {
        return await context.Users.FindAsync(userId);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .Include(x => x.ProfilePhotos)
            .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
