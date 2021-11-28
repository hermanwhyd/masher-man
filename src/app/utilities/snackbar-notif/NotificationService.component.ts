import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// https://indepth.dev/posts/1465/expecting-the-unexpected-best-practices-for-error-handling-in-angular-2

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  showSuccess(message: string): void {
    this.snackBar.open(message);
  }

  showError(message: string): void {
    // The second parameter is the text in the button.
    // In the third, we send in the css class for the snack bar.
    this.snackBar.open(message, 'X', { panelClass: ['error'] });
  }
}
