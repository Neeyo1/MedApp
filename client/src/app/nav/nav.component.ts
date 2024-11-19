import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ChangePasswordModalComponent } from '../modals/change-password-modal/change-password-modal.component';

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
  bsModalRef: BsModalRef<ChangePasswordModalComponent> = new BsModalRef<ChangePasswordModalComponent>();

  login(){
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl("/")
      },
      error: error => this.toastrService.error(error.error)
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

  openChangePasswordModal(){
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(ChangePasswordModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content && this.bsModalRef.content.completed){
          const changePasswordForm = this.bsModalRef.content.changePasswordForm;

          this.accountService.changePassword(changePasswordForm.value).subscribe({
            next: _ => this.toastrService.success("Password changed successfully"),
            error: error => this.toastrService.error(error.error)
          })
        }
      }
    })
  }
}
