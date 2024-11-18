import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppointmentService } from '../../_services/appointment.service';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [FormsModule, PaginationModule, DatePipe],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements OnInit, OnDestroy{
  appointmentService = inject(AppointmentService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.appointmentService.paginatedResult.set(null);
  }

  loadAppointments(){
    if (this.accountService.roles().includes("Patient")){
      this.appointmentService.getMyAppointmentsAsPatient();
    } else if (this.accountService.roles().includes("Doctor")){
      this.appointmentService.getMyAppointmentsAsDoctor();
    }
  }

  cancelAppointment(appointmentId: number){
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: _ => this.loadAppointments(),
      error: error => this.toastrService.error(error.error)
    });
  }

  openDetails(appointmentId: number){
    this.router.navigateByUrl("/appointments/" + appointmentId);
  }

  pageChanged(event: any){
    if (this.appointmentService.myAppointmentAsPatientParams().pageNumber != event.page){
      this.appointmentService.myAppointmentAsPatientParams().pageNumber = event.page;
      this.loadAppointments();
    }
  }
}
