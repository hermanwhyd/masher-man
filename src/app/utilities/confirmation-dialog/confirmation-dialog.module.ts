import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IconModule } from '@visurel/iconify-angular';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    IconModule,
    MatDividerModule,
    MatButtonModule,
    MatRippleModule,
    FlexLayoutModule,
    MatToolbarModule
  ],
  exports: [ConfirmationDialogComponent]
})
export class ConfirmationDialogModule { }
