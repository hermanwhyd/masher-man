import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackbarNotif } from './snackbar-notif.interface';

@Component({
  template: `
  <div fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="10px">
    <span [ngClass]="{danger:'text-red', info:'text-cyan', success:'text-green'}[data.type]">
      {{ data.message }}
    </span>
    <button mat-stroked-button color="accent" (click)="snackBarRef.dismiss()">CLOSE</button>
  </div>
  `,
})
export class SnackbarNotifComponent {
  constructor(public snackBarRef: MatSnackBarRef<SnackbarNotifComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarNotif) { }
}
