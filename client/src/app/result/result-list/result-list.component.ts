import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ResultService } from '../../_services/result.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ResultModalComponent } from '../../modals/result-modal/result-modal.component';
import { Result } from '../../_models/result';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [PaginationModule, FormsModule, DatePipe],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.css'
})
export class ResultListComponent implements OnInit, OnDestroy{
  resultService = inject(ResultService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  accountService = inject(AccountService);
  private modalService = inject(BsModalService);
  bsModalRef: BsModalRef<ResultModalComponent> = new BsModalRef<ResultModalComponent>();

  ngOnInit(): void {
    if (this.accountService.roles().includes("Patient")){
      this.loadMyResultsAsPatient();
    } else if (this.accountService.roles().includes("Doctor")){
      this.loadMyResultsAsDoctor();
    }
  }

  ngOnDestroy(): void {
    this.resultService.paginatedResult.set(null);
  }

  loadMyResultsAsPatient(){
    this.resultService.getMyResultsAsPatient();
  }

  loadMyResultsAsDoctor(){
    this.resultService.getMyResultsAsDoctor();
  }

  openDetails(resultId: number){
    this.router.navigateByUrl("/results/" + resultId);
  }

  openEditResultModal(result: Result | null){
    if (result == null) return;
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        result: result
      }
    };
    this.bsModalRef = this.modalService.show(ResultModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content && this.bsModalRef.content.completed){
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

  deleteResult(resultId: number){
    this.toastrService.info("delete modal")
  }

  pageChanged(event: any){
    if (this.resultService.resultParams().pageNumber != event.page){
      this.resultService.resultParams().pageNumber = event.page;
      if (this.accountService.roles().includes("Patient")){
        this.loadMyResultsAsPatient();
      } else if (this.accountService.roles().includes("Doctor")){
        this.loadMyResultsAsDoctor();
      }
    }
  }
}
