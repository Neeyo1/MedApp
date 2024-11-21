import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentDetailed } from '../../_models/appointmentDetailed';
import { AppointmentService } from '../../_services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResultModalComponent } from '../../modals/result-modal/result-modal.component';
import { ModalService } from '../../_services/modal.service';

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
  private router = inject(Router);
  accountService = inject(AccountService);
  appointment = signal<AppointmentDetailed | null>(null);
  private myModalService = inject(ModalService);
  bsModalRef: BsModalRef<ResultModalComponent> = new BsModalRef<ResultModalComponent>();

  ngOnInit(): void {
    this.loadAppointment();
  }

  loadAppointment(){
    const appointmentId = Number(this.route.snapshot.paramMap.get("id"));
    if (!appointmentId) this.router.navigateByUrl("/not-found");;

    this.appointmentService.getAppointmentDetailed(appointmentId).subscribe({
      next: appointment => this.appointment.set(appointment)
    })
  }

  setAsCompleted(appointmentId: number){
    this.appointmentService.setAppointmentAsCompleted(appointmentId).subscribe({
      next: _ => this.loadAppointment()
    })
  }

  setAsUncompleted(appointmentId: number){
    this.appointmentService.setAppointmentAsUncompleted(appointmentId).subscribe({
      next: _ => this.loadAppointment()
    })
  }

  createResult(patientId: number, officeId: number){
    this.myModalService.openCreateResultModal(patientId, officeId)
  }
  
}
