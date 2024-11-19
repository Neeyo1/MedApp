import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';

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
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      apartment: ['', [Validators.required]],
      mondayHours: [''],
      tuesdayHours: [''],
      wednesdayHours: [''],
      thursdayHours: [''],
      fridayHours: [''],
      saturdayHours: [''],
      sundayHours: ['']
    })
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
