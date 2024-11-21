import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.css'
})
export class AppointmentModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  private fb = inject(FormBuilder);
  appointmentForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.appointmentForm = this.fb.group({
      month: [0, [Validators.required, this.hasOnlyNumbers()]],
      year: [0, [Validators.required, this.hasOnlyNumbers()]]
    })
  }

  hasOnlyNumbers(): ValidatorFn{
    return (control: AbstractControl) => {
      return /^[0-9]*$/ .test(control.value) === true ? null : {hasOnlyNumbers: true};
    }
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
