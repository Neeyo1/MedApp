import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangePasswordModalComponent } from '../modals/change-password-modal/change-password-modal.component';
import { ModalService } from '../_services/modal.service';
import { AdminService } from '../_services/admin.service';
import { AppointmentService } from '../_services/appointment.service';
import { OfficeService } from '../_services/office.service';
import { ResultService } from '../_services/result.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  model: any = {};
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);
  private modalService = inject(BsModalService);
  private myModalService = inject(ModalService);
  private adminservice = inject(AdminService);
  private appointmentService = inject(AppointmentService);
  private officeService = inject(OfficeService);
  private resultService = inject(ResultService);
  bsModalRef: BsModalRef<ChangePasswordModalComponent> = new BsModalRef<ChangePasswordModalComponent>();

  login(){
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl("/")
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.adminservice.resetEverything();
    this.appointmentService.resetEverything();
    this.officeService.resetEverything();
    this.resultService.resetEverything();
    this.router.navigateByUrl("/");
  }

  changePassword(){
    this.myModalService.openChangePasswordModal();
  }

  askForVerification(){
    this.accountService.askForVerification().subscribe({
      next: _ => this.toastrService.success("Ask for verivication successfully sent")
    })
  }
}
