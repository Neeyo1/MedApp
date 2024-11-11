using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IAppointmentRepository
{
    void AddAppointment(Appointment appointment);
    void DeleteAppointment(Appointment appointment);
    Task<Appointment?> GetAppointmentByIdAsync(int appointmentId);
    Task<PagedList<AppointmentDto>> GetAppointmentsAsync(AppointmentParams appointmentParams);
    Task<PagedList<AppointmentDto>> GetAppointmentsInMonthAsync(AppointmentParams appointmentParams);
    Task<bool> IsAppointmentExisting(int officeId, DateTime dateStart);
    Task<bool> Complete();
}
