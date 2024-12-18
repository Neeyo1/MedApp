import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OfficeService } from '../../_services/office.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Office } from '../../_models/office';
import { AccountService } from '../../_services/account.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppointmentService } from '../../_services/appointment.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OfficeModalComponent } from '../../modals/office-modal/office-modal.component';
import { ModalService } from '../../_services/modal.service';

@Component({
  selector: 'app-office-detail',
  standalone: true,
  imports: [TabsModule, PaginationModule, FormsModule, DatePipe],
  templateUrl: './office-detail.component.html',
  styleUrl: './office-detail.component.css'
})
export class OfficeDetailComponent implements OnInit, OnDestroy{
  private officeService = inject(OfficeService);
  appointmentService = inject(AppointmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  office = signal<Office | null>(null);
  accountService = inject(AccountService);
  private myModalService = inject(ModalService);
  bsModalRef: BsModalRef<OfficeModalComponent> = new BsModalRef<OfficeModalComponent>();

  ngOnInit(): void {
    this.loadOffice();
  }

  ngOnDestroy(): void {
    this.appointmentService.paginatedResult.set(null);
  }

  loadOffice(){
    const officeId = Number(this.route.snapshot.paramMap.get("id"));
    if (!officeId) this.router.navigateByUrl("/not-found");

    this.officeService.getOffice(officeId).subscribe({
      next: office => this.office.set(office)
    })
  }

  loadAppointments(){
    const officeId = Number(this.route.snapshot.paramMap.get("id"));
    if (!officeId) this.router.navigateByUrl("/not-found");;

    this.appointmentService.appointmentParams().officeId = officeId;
    this.appointmentService.getAppointments();
  }

  bookAppointment(appointmentId: number){
    this.appointmentService.bookAppointment(appointmentId).subscribe({
      next: _ => this.loadAppointments()
    });
  }

  editAppointment(appointmentId: number){
    console.log("Edit modal");
  }

  deleteAppointment(appointmentId: number, name: string){
    this.myModalService.openConfirmModal(name)?.subscribe({
      next: result => {
        if (result){
          this.appointmentService.deleteAppointment(appointmentId).subscribe({
            next: _ => this.loadAppointments()
          });
        }
      }
    })
  }

  editOffice(office: Office | null){
    if (office == null) return;
    this.myModalService.openEditOfficeModal(office);
    this.loadOffice();
  }

  deleteOffice(officeId: number, name: string){
    this.myModalService.openConfirmModal(name)?.subscribe({
      next: result => {
        if (result){
          this.officeService.deleteOffice(officeId).subscribe({
            next: _ => this.router.navigateByUrl("/offices")
          });
        }
      }
    })
  }

  createAppointments(officeId: number){
    this.myModalService.openCreateAppointmentsModal(officeId);
  }

  pageChanged(event: any){
    if (this.appointmentService.appointmentParams().pageNumber != event.page){
      this.appointmentService.appointmentParams().pageNumber = event.page;
      this.loadAppointments();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
