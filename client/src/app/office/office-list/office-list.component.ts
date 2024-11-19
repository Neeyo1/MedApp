import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterLink } from '@angular/router';
import { OfficeService } from '../../_services/office.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { OfficeModalComponent } from '../../modals/office-modal/office-modal.component';

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
  private toastrService = inject(ToastrService);
  private modalService = inject(BsModalService);
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

  openOfficeModal(){
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(OfficeModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content && this.bsModalRef.content.completed){
          let officeForm = this.bsModalRef.content.officeForm;
          const days = ['mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 
            'saturdayHours', 'sundayHours']
          days.forEach(day => {
            if (officeForm.value[day] == ''){
              officeForm.value[day] = [];
            } else{
              officeForm.value[day] = officeForm.value[day].split(',').map(Number);
            }
          });

          this.officeService.createOffice(officeForm.value).subscribe({
            next: _ => this.officeService.getOffices(),
            error: error => this.toastrService.error(error.error)
          })
        }
      }
    })
  }

  resetFilters(){
    this.officeService.resetOfficeParams();
    this.loadOffices();
  }

  pageChanged(event: any){
    if (this.officeService.officeParams().pageNumber != event.page){
      this.officeService.officeParams().pageNumber = event.page;
      this.loadOffices();
    }
  }
}
