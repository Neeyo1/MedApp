import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AppointmentDetailed } from '../../_models/appointmentDetailed';
import { AppointmentService } from '../../_services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css'
})
export class AppointmentDetailComponent implements OnInit{
  private appointmentService = inject(AppointmentService);
  private route = inject(ActivatedRoute);
  private toastrServie = inject(ToastrService);
  private router = inject(Router);
  appointment = signal<AppointmentDetailed | null>(null);

  ngOnInit(): void {
    this.loadAppointment();
  }

  loadAppointment(){
    const appointmentId = Number(this.route.snapshot.paramMap.get("id"));
    if (!appointmentId) return;

    this.appointmentService.getAppointmentDetailed(appointmentId).subscribe({
      next: appointment => this.appointment.set(appointment),
      error: error => {
        this.toastrServie.error(error.error);
        this.router.navigateByUrl("/");
      }
    })
  }
}
