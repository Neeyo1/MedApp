import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OfficeService } from '../../_services/office.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Office } from '../../_models/office';
import { AccountService } from '../../_services/account.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppointmentService } from '../../_services/appointment.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
  private toastrServie = inject(ToastrService);
  private router = inject(Router);
  office = signal<Office | null>(null);
  accountService = inject(AccountService);

  ngOnInit(): void {
    this.loadOffice();
  }

  ngOnDestroy(): void {
    this.appointmentService.paginatedResult.set(null);
  }

  loadOffice(){
    const officeId = Number(this.route.snapshot.paramMap.get("id"));
    if (!officeId) return;

    this.officeService.getOffice(officeId).subscribe({
      next: office => this.office.set(office)
    })
  }

  loadAppointments(){
    const officeId = Number(this.route.snapshot.paramMap.get("id"));
    if (!officeId) return;

    this.appointmentService.appointmentParams().officeId = officeId;
    this.appointmentService.getAppointments();
  }

  bookAppointment(appointmentId: number){
    this.appointmentService.bookAppointment(appointmentId).subscribe({
      next: _ => this.loadAppointments(),
      error: error => this.toastrServie.error(error.error)
    });
  }

  editAppointment(appointmentId: number){
    console.log("Edit modal");
  }

  deleteAppointment(appointmentId: number){
    this.appointmentService.deleteAppointment(appointmentId).subscribe({
      next: _ => this.loadAppointments(),
      error: error => this.toastrServie.error(error.error)
    });
  }

  pageChanged(event: any){
    if (this.appointmentService.appointmentParams().pageNumber != event.page){
      this.appointmentService.appointmentParams().pageNumber = event.page;
      this.loadAppointments();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
