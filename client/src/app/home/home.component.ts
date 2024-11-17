import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppointmentService } from '../_services/appointment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  appointmentService = inject(AppointmentService);

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.appointmentService.paginatedResult.set(null);
  }

  loadAppointments(){
    this.appointmentService.getMyAllAppointmentsAsPatient();
  }
}
