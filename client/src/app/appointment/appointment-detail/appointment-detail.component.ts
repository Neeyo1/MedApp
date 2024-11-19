import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AppointmentDetailed } from '../../_models/appointmentDetailed';
import { AppointmentService } from '../../_services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ResultModalComponent } from '../../modals/result-modal/result-modal.component';
import { ResultService } from '../../_services/result.service';

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
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  accountService = inject(AccountService);
  private resultService = inject(ResultService);
  appointment = signal<AppointmentDetailed | null>(null);
  private modalService = inject(BsModalService);
  bsModalRef: BsModalRef<ResultModalComponent> = new BsModalRef<ResultModalComponent>();

  ngOnInit(): void {
    this.loadAppointment();
  }

  loadAppointment(){
    const appointmentId = Number(this.route.snapshot.paramMap.get("id"));
    if (!appointmentId) return;

    this.appointmentService.getAppointmentDetailed(appointmentId).subscribe({
      next: appointment => this.appointment.set(appointment),
      error: error => {
        this.toastrService.error(error.error);
        this.router.navigateByUrl("/");
      }
    })
  }

  setAsCompleted(appointmentId: number){
    this.appointmentService.setAppointmentAsCompleted(appointmentId).subscribe({
      next: _ => this.loadAppointment(),
      error: error => this.toastrService.error(error.error)
    })
  }

  setAsUncompleted(appointmentId: number){
    this.appointmentService.setAppointmentAsUncompleted(appointmentId).subscribe({
      next: _ => this.loadAppointment(),
      error: error => this.toastrService.error(error.error)
    })
  }

  showResultModal(){
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(ResultModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content && this.bsModalRef.content.completed){
          let resultForm = this.bsModalRef.content.resultForm;
          resultForm.value['patientId'] = this.appointment()?.patient?.id;
          resultForm.value['officeId'] = this.appointment()?.office.id;

          this.resultService.createResult(resultForm.value).subscribe({
            next: _ => this.resultService.getMyResultsAsDoctor(),
            error: error => this.toastrService.error(error.error)
          })
        }
      }
    })
  }
}
