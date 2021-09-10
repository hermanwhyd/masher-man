import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { InformationDialogComponent } from './information-dialog.component';

@NgModule({
  declarations: [InformationDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    IconModule,
    MatDividerModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  exports: [InformationDialogComponent]
})
export class InformationDialogModule { }
