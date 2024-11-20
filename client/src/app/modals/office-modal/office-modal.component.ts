import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { Office } from '../../_models/office';

@Component({
  selector: 'app-office-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './office-modal.component.html',
  styleUrl: './office-modal.component.css'
})
export class OfficeModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  office?: Office;
  private fb = inject(FormBuilder);
  officeForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  days = [
    {value: 'mondayHours', label: 'Monday hours'},
    {value: 'tuesdayHours', label: 'Tuesday hours'},
    {value: 'wednesdayHours', label: 'Wednesday hours'},
    {value: 'thursdayHours', label: 'Thursday hours'},
    {value: 'fridayHours', label: 'Friday hours'},
    {value: 'saturdayHours', label: 'Saturday hours'},
    {value: 'sundayHours', label: 'Sunday hours'}
  ]

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.officeForm = this.fb.group({
      name: [this.office?.name == null ? '' : this.office.name, [Validators.required]],
      city: [this.office?.city == null ? '' : this.office.city, [Validators.required]],
      street: [this.office?.street == null ? '' : this.office.street, [Validators.required]],
      apartment: [this.office?.apartment == null ? '' : this.office.apartment, [Validators.required]],
      mondayHours: [this.office?.mondayHours == null ? '' : this.office.mondayHours.join(',')],
      tuesdayHours: [this.office?.tuesdayHours == null ? '' : this.office.tuesdayHours.join(',')],
      wednesdayHours: [this.office?.wednesdayHours == null ? '' : this.office.wednesdayHours.join(',')],
      thursdayHours: [this.office?.thursdayHours == null ? '' : this.office.thursdayHours.join(',')],
      fridayHours: [this.office?.fridayHours == null ? '' : this.office.fridayHours.join(',')],
      saturdayHours: [this.office?.saturdayHours == null ? '' : this.office.saturdayHours.join(',')],
      sundayHours: [this.office?.sundayHours == null ? '' : this.office.sundayHours.join(',')]
    })
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
