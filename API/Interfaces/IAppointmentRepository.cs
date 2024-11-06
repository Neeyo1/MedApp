using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IAppointmentRepository
{
    void AddAppointment(Appointment appointment);
    void DeleteAppointment(Appointment appointment);
    Task<Appointment?> GetAppointmentByIdAsync(int appointmentId);
    Task<IEnumerable<AppointmentDto>> GetAppointmentsAsync(int officeId);
    Task<IEnumerable<AppointmentDto>> GetAppointmentsInMonthAsync(int officeId, int year, int month);
    Task<bool> IsAppointmentExisting(int officeId, DateTime dateStart);
    Task<bool> Complete();
}
