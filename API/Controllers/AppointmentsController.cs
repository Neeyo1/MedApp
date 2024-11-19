using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class AppointmentsController(IAppointmentRepository appointmentRepository, IMapper mapper,
    IUserRepository userRepository, IOfficeRepository officeRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<AppointmentDto>>> GetAppointments(
        [FromQuery] AppointmentParams appointmentParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        appointmentParams.PatientId = 0;

        var appointments = await appointmentRepository.GetAppointmentsAsync(appointmentParams);
        Response.AddPaginationHeader(appointments);
        return Ok(appointments);
    }

    [Authorize(Policy = "RequirePatientRole")]
    [HttpGet("patient/my")]
    public async Task<ActionResult<PagedList<AppointmentDto>>> GetMyAppointmentsAsPatient(
        [FromQuery] AppointmentParams appointmentParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        appointmentParams.PatientId = user.Id;

        var appointments = await appointmentRepository.GetAppointmentsAsync(appointmentParams);
        Response.AddPaginationHeader(appointments);
        return Ok(appointments);
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpGet("doctor/my")]
    public async Task<ActionResult<PagedList<AppointmentDto>>> GetMyAppointmentsAsDoctor(
        [FromQuery] AppointmentParams appointmentParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        appointmentParams.DoctorId = user.Id;

        var appointments = await appointmentRepository.GetAppointmentsAsync(appointmentParams);
        Response.AddPaginationHeader(appointments);
        return Ok(appointments);
    }

    [HttpGet("{appointmentId}")]
    public async Task<ActionResult<OfficeDto>> GetAppointment(int appointmentId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var appointment = await appointmentRepository.GetAppointmentDetailedByIdAsync(appointmentId);
        if (appointment == null) return BadRequest("Appointment does not exist");

        if (appointment.Office.DoctorId != user.Id && (appointment.PatientId != user.Id))
            return Unauthorized();

        var result = mapper.Map<AppointmentDetailedDto>(appointment);

        return Ok(result);
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpPost]
    public async Task<ActionResult<OfficeDto>> CreateAppointments([FromQuery] int officeId, int year, int month)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var office = await officeRepository.GetOfficeByIdAsync(officeId);
        if (office == null) return BadRequest("Office does not exist");
        if (office.DoctorId != user.Id) return Unauthorized();

        var days = DateTime.DaysInMonth(year, month);
        for (int day = 1; day <= days; day++)
        {
            var newDate = new DateTime(year, month, day);
            var workHours = newDate.DayOfWeek switch
            {
                DayOfWeek.Monday => office.MondayHours,
                DayOfWeek.Tuesday => office.TuesdayHours,
                DayOfWeek.Wednesday => office.WednesdayHours,
                DayOfWeek.Thursday => office.ThursdayHours,
                DayOfWeek.Friday => office.FridayHours,
                DayOfWeek.Saturday => office.SaturdayHours,
                DayOfWeek.Sunday => office.SundayHours,
                _ => []
            };
            foreach (var hour in workHours)
            {
                var appointmentDate = new DateTime(year, month, day, hour, 0, 0).ToUniversalTime();
                var appointment = new Appointment
                {
                    DateStart = appointmentDate,
                    DateEnd = appointmentDate.AddHours(1),
                    Office = office
                };
                if (!await appointmentRepository.IsAppointmentExisting(officeId, appointmentDate))
                    appointmentRepository.AddAppointment(appointment);
            }
        }

        if (await appointmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to create appointments");
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpDelete("{appointmentId}")]
    public async Task<ActionResult> DeleteAppointment(int appointmentId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var appointment = await appointmentRepository.GetAppointmentByIdAsync(appointmentId);
        if (appointment == null) return BadRequest("Could not find appointment");

        var office = await officeRepository.GetOfficeByIdAsync(appointment.OfficeId);
        if (office == null) return BadRequest("Office does not exist");
        if (office.DoctorId != user.Id) return Unauthorized();

        if (appointment.HasEnded == true) return BadRequest("You cannot delete ended appointments");
        
        appointmentRepository.DeleteAppointment(appointment);

        if (await appointmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete appointment");
    }

    [Authorize(Policy = "RequirePatientRole")]
    [HttpPost("{appointmentId}/register")]
    public async Task<ActionResult> RegisterToAppointment(int appointmentId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var appointment = await appointmentRepository.GetAppointmentByIdAsync(appointmentId);
        if (appointment == null) return BadRequest("Could not find appointment");
        if (appointment.IsOpen == false) return BadRequest("Appointment is not open for registration");
        if (appointment.DateStart <= DateTime.UtcNow) return BadRequest("Its too late to register to this appointment");
        
        appointment.Patient = user;
        appointment.IsOpen = false;

        if (await appointmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to register to appointment");
    }

    [Authorize(Policy = "RequirePatientRole")]
    [HttpPost("{appointmentId}/cancel")]
    public async Task<ActionResult> CancelRegistrationToAppointment(int appointmentId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var appointment = await appointmentRepository.GetAppointmentByIdAsync(appointmentId);
        if (appointment == null) return BadRequest("Could not find appointment");
        if (appointment.Patient != user) return Unauthorized();
        if (appointment.IsOpen == true) return BadRequest("Appointment is not closed");
        if (appointment.HasEnded == true) return BadRequest("Appointment is set as completed");
        if (appointment.DateStart <= DateTime.UtcNow)
            return BadRequest("Its too late to cancel registration to this appointment");
        
        appointment.Patient = null!;
        appointment.IsOpen = true;

        if (await appointmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to cancel appointment");
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpPost("{appointmentId}/complete")]
    public async Task<ActionResult> SetAppointmentAsComplete(int appointmentId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var appointment = await appointmentRepository.GetAppointmentByIdAsync(appointmentId);
        if (appointment == null) return BadRequest("Could not find appointment");
        if (appointment.IsOpen == true) return BadRequest("Appointment is not closed");
        if (appointment.HasEnded == true) return BadRequest("Appointment is set as completed");
        
        var office = await officeRepository.GetOfficeByIdAsync(appointment.OfficeId);
        if (office == null) return BadRequest("Office does not exist");
        if (office.DoctorId != user.Id) return Unauthorized();
        if (appointment.DateStart > DateTime.UtcNow)
            return BadRequest("You cannot set appointed as completed that did not start yet");
        
        appointment.HasEnded = true;

        if (await appointmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to set appointment as completed");
    }

    [Authorize(Policy = "RequireDoctorRole")]
    [HttpPost("{appointmentId}/uncomplete")]
    public async Task<ActionResult> SetAppointmentAsUncomplete(int appointmentId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var appointment = await appointmentRepository.GetAppointmentByIdAsync(appointmentId);
        if (appointment == null) return BadRequest("Could not find appointment");
        if (appointment.IsOpen == true) return BadRequest("Appointment is not closed");
        if (appointment.HasEnded == false) return BadRequest("Appointment is set as uncompleted");
        
        var office = await officeRepository.GetOfficeByIdAsync(appointment.OfficeId);
        if (office == null) return BadRequest("Office does not exist");
        if (office.DoctorId != user.Id) return Unauthorized();
        
        appointment.HasEnded = false;

        if (await appointmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to set appointment as uncompleted");
    }
}
