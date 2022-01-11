import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

import { SetupRoutingModule } from './setup-routing.module';
import { SetupComponent } from './setup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatListModule } from '@angular/material/list';
import { SetupApiComponent } from './components/setup-api/setup-api.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SetupUserComponent } from './components/setup-user/setup-user.component';
import { SnackBarNotifModule } from 'src/app/utilities/snackbar-notif/snackbar-notif.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonLoadingModule } from 'src/app/utilities/mat-button-loading/mat-button-loading.module';
import { SetupUserEditComponent } from './components/setup-user/setup-user-edit/setup-user-edit.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SetupTierComponent } from './components/setup-tier/setup-tier.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ArraySortPipe } from 'src/app/pipes/array-sort.pipe';

@NgModule({
  declarations: [SetupComponent, SetupApiComponent, SetupUserComponent, SetupUserEditComponent, SetupTierComponent, ArraySortPipe],
  imports: [
    CommonModule,
    SetupRoutingModule,
    FlexLayoutModule,
    ContainerModule,
    PageLayoutModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatIconModule,
    IconModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    SnackBarNotifModule,
    MatTooltipModule,
    MatButtonLoadingModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ]
})
export class SetupModule { }
