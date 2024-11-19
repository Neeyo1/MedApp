import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AppointmentDetailed } from '../../_models/appointmentDetailed';
import { AppointmentService } from '../../_services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AccountService } from '../../_services/account.service';

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
  accountService = inject(AccountService);
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

  setAsCompleted(appointmentId: number){
    this.appointmentService.setAppointmentAsCompleted(appointmentId).subscribe({
      next: _ => this.loadAppointment(),
      error: error => this.toastrServie.error(error.error)
    })
  }

  setAsUncompleted(appointmentId: number){
    this.appointmentService.setAppointmentAsUncompleted(appointmentId).subscribe({
      next: _ => this.loadAppointment(),
      error: error => this.toastrServie.error(error.error)
    })
  }

  showResultModal(){
    this.toastrServie.info("Show result create modal")
  }
}
