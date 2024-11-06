using API.DTOs;
using API.Entities;
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

    public async Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync(int officeId)
    {
        return await context.Appointments
            .Where(x => x.OfficeId == officeId)
            .ProjectTo<AppointmentDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<IEnumerable<AppointmentDto>> GetAppointmentsInMonthAsync(int officeId, 
        int year, int month)
    {
        return await context.Appointments
            .Where(x => x.OfficeId == officeId && x.DateStart.Year == year && x.DateStart.Month == month)
            .ProjectTo<AppointmentDto>(mapper.ConfigurationProvider)
            .ToListAsync();
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
