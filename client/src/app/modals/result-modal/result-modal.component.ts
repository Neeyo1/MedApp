import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Result } from '../../_models/result';

@Component({
  selector: 'app-result-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './result-modal.component.html',
  styleUrl: './result-modal.component.css'
})
export class ResultModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  result?: Result;
  private fb = inject(FormBuilder);
  resultForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.resultForm = this.fb.group({
      name: [this.result?.name == null ? '' : this.result.name, [Validators.required]],
      description: [this.result?.description == null ? '' : this.result.description, [Validators.required]]
    })
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
