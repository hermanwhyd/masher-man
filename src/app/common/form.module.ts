import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const MODULES = [
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class FormModule { }
