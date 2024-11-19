using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppointmentRepository(DataContext context, IMapper mapper) : IAppointmentRepository
{
    public void AddAppointment(Appointment appointment)
    {
        context.Appointments.Add(appointment);
    }

    public void DeleteAppointment(Appointment appointment)
    {
        context.Appointments.Remove(appointment);
    }

    public async Task<Appointment?> GetAppointmentByIdAsync(int appointmentId)
    {
        return await context.Appointments
            .FindAsync(appointmentId);
    }

    public async Task<Appointment?> GetAppointmentDetailedByIdAsync(int appointmentId)
    {
        return await context.Appointments
            .Include(x => x.Office)
            .ThenInclude(x => x.Doctor)
            .Include(x => x.Patient)
            .FirstOrDefaultAsync(x => x.Id == appointmentId);
    }

    public async Task<PagedList<AppointmentDto>> GetAppointmentsAsync(AppointmentParams appointmentParams)
    {
        var query = context.Appointments.AsQueryable();

        if (appointmentParams.OfficeId != 0)
        {
            query = query.Where(x => x.OfficeId == appointmentParams.OfficeId);
        }

        if (appointmentParams.PatientId != 0)
        {
            query = query.Where(x => x.PatientId == appointmentParams.PatientId);
        }

        if (appointmentParams.DoctorId != 0)
        {
            query = query.Where(x => x.Office.DoctorId == appointmentParams.DoctorId);
        }

        if (appointmentParams.Year != 0)
        {
            query = query.Where(x => x.DateStart.Year == appointmentParams.Year);
        }

        if (appointmentParams.Month != 0)
        {
            query = query.Where(x => x.DateStart.Month == appointmentParams.Month);
        }

        query = appointmentParams.Status switch
        {
            "open" => query.Where(x => x.IsOpen == true && x.DateStart > DateTime.UtcNow),
            "close" => query.Where(x => x.IsOpen == false && x.DateStart > DateTime.UtcNow),
            "archive" => query.Where(x => x.DateStart < DateTime.UtcNow),
            _ => query
        };

        query = appointmentParams.OrderBy switch
        {
            "furthest" => query.OrderByDescending(x => x.DateStart),
            "closest" => query.OrderBy(x => x.DateStart),
            _ => query
        };

        return await PagedList<AppointmentDto>.CreateAsync(
            query.ProjectTo<AppointmentDto>(mapper.ConfigurationProvider), 
            appointmentParams.PageNumber, appointmentParams.PageSize);
    }

    public async Task<bool> IsAppointmentExisting(int officeId, DateTime dateStart)
    {
        var appointment = await context.Appointments
            .FirstOrDefaultAsync(x => x.OfficeId == officeId && x.DateStart == dateStart);
            
        return appointment != null;
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
