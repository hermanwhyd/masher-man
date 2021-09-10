import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import icClose from '@iconify/icons-ic/twotone-close';

@Component({
  selector: 'vex-information-dialog',
  templateUrl: 'information-dialog.component.html',
})
export class InformationDialogComponent {
  icClose = icClose;

  message = 'Are you sure?';
  cancelButtonText = 'Cancel';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<InformationDialogComponent>) {
    if (this.data) {
      this.message = this.data.message || this.message;
      if (data.buttonText) {
        this.cancelButtonText = this.data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
