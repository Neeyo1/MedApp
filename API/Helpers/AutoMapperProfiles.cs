using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<RegisterDto, AppUser>();
        CreateMap<AppUser, UserDto>()
            .ForMember(
                x => x.ProfilePhotoUrl, y => y.MapFrom(z => z.ProfilePhotos.FirstOrDefault(p => p.IsMain)!.Url)
            );
        CreateMap<AppUser, MemberDto>()
            .ForMember(
                x => x.ProfilePhotoUrl, y => y.MapFrom(z => z.ProfilePhotos.FirstOrDefault(p => p.IsMain)!.Url)
            );
        CreateMap<Office, OfficeDto>()
            .ForMember(
                x => x.Specializations, y => y.MapFrom(z => z.OfficeSpecializations.Select(
                    s => s.Specialization.Name).ToList())
            );
        CreateMap<OfficeCreateDto, Office>();
        CreateMap<Appointment, AppointmentDto>();
        CreateMap<Result, ResultDto>();
        CreateMap<ResultCreateDto, Result>();
        CreateMap<Verification, VerificationDto>()
            .ForMember(x => x.UserId, y => y.MapFrom(z => z.UserId))
            .ForMember(x => x.FirstName, y => y.MapFrom(z => z.User == null ? null : z.User.FirstName))
            .ForMember(x => x.LastName, y => y.MapFrom(z => z.User == null ? null : z.User.LastName));
        CreateMap<ProfilePhoto, ProfilePhotoDto>();
        CreateMap<Specialization, SpecializationDto>();
        CreateMap<SpecializationCreateDto, Specialization>();

        CreateMap<DateTime, DateTime>().ConvertUsing(x => DateTime.SpecifyKind(x, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(x => x.HasValue 
            ? DateTime.SpecifyKind(x.Value, DateTimeKind.Utc) : null);
    }
}
