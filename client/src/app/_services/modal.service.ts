import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef?: BsModalRef;
  private modalService = inject(BsModalService);

  confirm(name: string){
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
}
