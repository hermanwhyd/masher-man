import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

const MODULES = [
  MatButtonModule,
  MatRippleModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MatButtonFamilyModule { }
