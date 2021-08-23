import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupEnumEditComponent } from './setup-enum-edit.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IconModule } from '@visurel/iconify-angular';

@NgModule({
  declarations: [SetupEnumEditComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FlexLayoutModule,
    MatInputModule,
    MatDividerModule,
    IconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  exports: [SetupEnumEditComponent]
})
export class SetupEnumEditModule { }
