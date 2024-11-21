import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-verification-list',
  standalone: true,
  imports: [],
  templateUrl: './verification-list.component.html',
  styleUrl: './verification-list.component.css'
})
export class VerificationListComponent implements OnInit, OnDestroy{
  private toastrService = inject(ToastrService);
  adminService = inject(AdminService)

  ngOnInit(): void {
    this.loadVerifications();
  }

  ngOnDestroy(): void {
    this.adminService.result.set(null);
  }

  loadVerifications(){
    this.adminService.getVerifications();
  }

  confirmAsDoctor(verificationId: number){
    this.adminService.confirmAsDoctor(verificationId).subscribe({
      next: _ => {
        this.toastrService.success("Successfully granted doctor role")
        this.loadVerifications();
      },
      error: error => this.toastrService.error(error.error)
    })
  }
}
