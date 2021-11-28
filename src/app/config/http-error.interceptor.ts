import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { RollbarService } from '../app.module';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(public snackBar: MatSnackBar, private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const rollbar = this.injector.get(RollbarService);

          const reason = error?.error?.description
            ? [error.error.code, error.error.message, error.error.description].filter((f) => f !== '').join(' | ')
            : 'Unexpected Error. F12 for more detail!';
          this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: reason, type: 'danger' } });

          rollbar.error(new Error(reason).stack);
          return throwError(error);
        })
      );
  }
}
