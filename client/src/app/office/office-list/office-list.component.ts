import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { OfficeService } from '../../_services/office.service';
import { AccountService } from '../../_services/account.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OfficeModalComponent } from '../../modals/office-modal/office-modal.component';
import { ModalService } from '../../_services/modal.service';

@Component({
  selector: 'app-office-list',
  standalone: true,
  imports: [FormsModule, PaginationModule, RouterLink],
  templateUrl: './office-list.component.html',
  styleUrl: './office-list.component.css'
})
export class OfficeListComponent implements OnInit, OnDestroy{
  officeService = inject(OfficeService);
  accountService = inject(AccountService);
  private myModalService = inject(ModalService);
  bsModalRef: BsModalRef<OfficeModalComponent> = new BsModalRef<OfficeModalComponent>();

  ngOnInit(): void {
    this.loadOffices();
  }

  ngOnDestroy(): void {
    this.officeService.paginatedResult.set(null);
  }

  loadOffices(){
    if (this.accountService.roles().includes("Doctor") && this.accountService.currentUser()){
      this.officeService.officeParams().doctorId = this.accountService.currentUser()!.id;
    }
    this.officeService.getOffices();
  }

  createOffice(){
    this.myModalService.openCreateOfficeModal();
  }

  resetFilters(){
    this.officeService.resetOfficeParams();
    this.loadOffices();
  }

  pageChanged(event: any){
    if (this.officeService.officeParams().pageNumber != event.page){
      this.officeService.officeParams().pageNumber = event.page;
      this.loadOffices();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
