import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
