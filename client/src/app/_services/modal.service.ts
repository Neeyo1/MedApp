import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs';
import { ChangePasswordModalComponent } from '../modals/change-password-modal/change-password-modal.component';
import { AccountService } from './account.service';
import { ToastrService } from 'ngx-toastr';
import { Result } from '../_models/result';
import { ResultModalComponent } from '../modals/result-modal/result-modal.component';
import { ResultService } from './result.service';
import { OfficeModalComponent } from '../modals/office-modal/office-modal.component';
import { OfficeService } from './office.service';
import { Office } from '../_models/office';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef?: BsModalRef;
  private modalService = inject(BsModalService);
  private accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private resultService = inject(ResultService);
  private officeService = inject(OfficeService);

  openConfirmModal(name: string){
      const config: ModalOptions = {
        initialState: {
          result: false,
          name: name
        }
      }
      this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);
      return this.bsModalRef.onHidden?.pipe(
        map(() => {
          if (this.bsModalRef?.content){
            return this.bsModalRef.content.result;
          } else{
            return false;
          }
        })
      )
  }

  openChangePasswordModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(ChangePasswordModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          const changePasswordForm = this.bsModalRef.content.changePasswordForm;

          this.accountService.changePassword(changePasswordForm.value).subscribe({
            next: _ => this.toastrService.success("Password changed successfully"),
            error: error => this.toastrService.error(error.error)
          })
        }
      }
    })
  }

  openCreateResultModal(patientId: number, officeId: number){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(ResultModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let resultForm = this.bsModalRef.content.resultForm;
          resultForm.value['patientId'] = patientId;
          resultForm.value['officeId'] = officeId;

          this.resultService.createResult(resultForm.value).subscribe({
            next: _ => this.resultService.getMyResultsAsDoctor(),
            error: error => this.toastrService.error(error.error)
          })
        }
      }
    })
  }

  openEditResultModal(result: Result){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        result: result
      }
    };
    this.bsModalRef = this.modalService.show(ResultModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          const resultForm = this.bsModalRef.content.resultForm;
          resultForm.value['patientId'] = result.patient.id;
          resultForm.value['officeId'] = result.office.id;

          this.resultService.editResult(result.id, resultForm.value).subscribe({
            next: _ => this.resultService.getMyResultsAsDoctor(),
            error: error => this.toastrService.error(error.error)
          })
        }
      }
    })
  }

  openCreateOfficeModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(OfficeModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
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

  openEditOfficeModal(office: Office){
    if (office == null) return;
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        office: office
      }
    };
    this.bsModalRef = this.modalService.show(OfficeModalComponent, config);
    return this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
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

          this.officeService.editOffice(office.id, officeForm.value).subscribe({
            next: _ => this.officeService.getOffices(),
            error: error => this.toastrService.error(error.error)
          })
        }
      }
    })
  }
}
