import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppointmentService } from '../../_services/appointment.service';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [FormsModule, PaginationModule, DatePipe],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements OnInit, OnDestroy{
  appointmentService = inject(AppointmentService);
  private toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.appointmentService.paginatedResult.set(null);
  }

  loadAppointments(){
    this.appointmentService.getMyAppointmentsAsPatient();
  }

  cancelAppointment(appointmentId: number){
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: _ => this.loadAppointments(),
      error: error => this.toastrService.error(error.error)
    });
  }

  pageChanged(event: any){
    if (this.appointmentService.myAppointmentAsPatientParams().pageNumber != event.page){
      this.appointmentService.myAppointmentAsPatientParams().pageNumber = event.page;
      this.loadAppointments();
    }
  }
}
