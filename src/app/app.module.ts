import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';
import { HttpErrorInterceptor } from './config/http-error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InformationDialogModule } from './utilities/information-dialog/information-dialog.module';
import { SnackBarNotifModule } from './utilities/snackbar-notif/snackbar-notif.module';
import { ConfirmationDialogModule } from './utilities/confirmation-dialog/confirmation-dialog.module';
import Rollbar from 'rollbar';
import { LoadingInterceptor } from './config/loading.interceptor';

const rollbarConfig = {
  accessToken: 'b996ba1861aa4525bb80c6d6280937b4',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}

export const RollbarService = new InjectionToken<Rollbar>('rollbar');


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,

    // Vex
    VexModule,
    CustomLayoutModule,

    // App
    InformationDialogModule,
    SnackBarNotifModule,
    ConfirmationDialogModule
  ],
  exports: [
    InformationDialogModule,
    SnackBarNotifModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: RollbarService,
      useFactory: rollbarFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
