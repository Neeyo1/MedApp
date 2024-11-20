import { Component, inject } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  preview = '';
  currentFile?: File;

  selectFile(event: any){
    this.preview = '';
    const selectedFiles = event.target.files;
  
    if (selectedFiles) {
      const file: File | null = selectedFiles.item(0);
  
      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  uploadPhoto(){
    if (this.currentFile){
      this.accountService.uploadPhoto(this.currentFile).subscribe({
        next: _ => {
          this.toastrService.success("Successfully uploaded photo");
          this.currentFile = undefined;
          this.preview = '';
        },
        error: error => this.toastrService.error(error.error)
      });
    }
  }

  deletePhoto(photoId: number){
    this.accountService.deletePhoto(photoId).subscribe({
      next: _ => this.toastrService.success("Successfully delete photo"),
      error: error => this.toastrService.error(error.error)
    });
  }

  mainPhoto(photoId: number){
    this.accountService.mainPhoto(photoId).subscribe({
      next: _ => this.toastrService.success("Successfully set photo as main"),
      error: error => this.toastrService.error(error.error)
    });
  }
}
