import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ResultService } from '../../_services/result.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

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

  editResult(resultId: number){
    this.toastrService.info("edit modal")
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
