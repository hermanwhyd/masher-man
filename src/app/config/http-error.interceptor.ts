import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GenericRs } from '../types/generic-rs.interface';
import { SnackbarNotifComponent } from '../utilities/snackbar-notif/snackbar-notif.component';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(public snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const genericRs = {
            code: error?.status,
            message: error?.message,
            data: error?.error
          } as GenericRs<any>;

          const reason = error?.error?.description
            ? [error.error.code, error.error.message, error.error.description].filter((f) => f !== '').join(' | ')
            : 'Unexpected Error. F12 for more detail.';
          this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: reason, type: 'danger' } });

          return throwError(genericRs);
        })
      );
  }
}
