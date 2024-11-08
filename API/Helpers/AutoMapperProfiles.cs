using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<RegisterDto, AppUser>();
        CreateMap<AppUser, UserDto>();
        CreateMap<AppUser, MemberDto>();
        CreateMap<Office, OfficeDto>();
        CreateMap<OfficeCreateDto, Office>();
        CreateMap<Appointment, AppointmentDto>();
        CreateMap<Result, ResultDto>();
        CreateMap<ResultCreateDto, Result>();
        CreateMap<Verification, VerificationDto>()
            .ForMember(x => x.UserId, y => y.MapFrom(z => z.UserId))
            .ForMember(x => x.FirstName, y => y.MapFrom(z => z.User == null ? null : z.User.FirstName))
            .ForMember(x => x.LastName, y => y.MapFrom(z => z.User == null ? null : z.User.LastName));

        CreateMap<DateTime, DateTime>().ConvertUsing(x => DateTime.SpecifyKind(x, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(x => x.HasValue 
            ? DateTime.SpecifyKind(x.Value, DateTimeKind.Utc) : null);
    }
}
