import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppointmentService } from '../_services/appointment.service';
import { DatePipe } from '@angular/common';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  appointmentService = inject(AppointmentService);
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.appointmentService.paginatedResult.set(null);
  }

  loadAppointments(){
    if (this.accountService.roles().includes("Patient")){
      this.appointmentService.getMyClosestAppointmentsAsPatient();
    } else if (this.accountService.roles().includes("Doctor")){
      this.appointmentService.getMyClosestAppointmentsAsDoctor();
    }
  }
}
