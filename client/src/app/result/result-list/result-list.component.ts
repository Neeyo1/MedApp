import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ResultService } from '../../_services/result.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResultModalComponent } from '../../modals/result-modal/result-modal.component';
import { Result } from '../../_models/result';
import { ModalService } from '../../_services/modal.service';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [PaginationModule, FormsModule, DatePipe],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.css'
})
export class ResultListComponent implements OnInit, OnDestroy{
  resultService = inject(ResultService);
  private router = inject(Router);
  accountService = inject(AccountService);
  private myModalService = inject(ModalService);
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

  editResult(result: Result){
    if (result == null) return;
    this.myModalService.openEditResultModal(result);
  }

  deleteResult(resultId: number, name: string){
    this.myModalService.openConfirmModal(name)?.subscribe({
      next: result => {
        if (result){
          this.resultService.deleteResult(resultId).subscribe({
            next: _ => this.loadMyResultsAsDoctor()
          });
        }
      }
    })
  }

  pageChanged(event: any){
    if (this.accountService.roles().includes("Patient")){
      if (this.resultService.resultParams().pageNumber != event.page){
        this.resultService.resultParams().pageNumber = event.page;
        this.loadMyResultsAsPatient();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (this.accountService.roles().includes("Doctor")){
      if (this.resultService.myResultAsDoctorParams().pageNumber != event.page){
        this.resultService.myResultAsDoctorParams().pageNumber = event.page;
        this.loadMyResultsAsDoctor();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}
