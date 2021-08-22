import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarNotifComponent } from './snackbar-notif.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SnackbarNotifComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [SnackbarNotifComponent],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } }
  ],
})
export class SnackBarNotifModule { }
