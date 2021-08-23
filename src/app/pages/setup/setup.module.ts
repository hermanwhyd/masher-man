import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

import { SetupRoutingModule } from './setup-routing.module';
import { SetupComponent } from './setup.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatListModule } from '@angular/material/list';
import { SetupEnumModule } from './components/setup-enum/setup-enum.module';
import { SetupApiComponent } from './components/setup-api/setup-api.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [SetupComponent, SetupApiComponent],
  imports: [
    CommonModule,
    SetupRoutingModule,
    FlexLayoutModule,
    ContainerModule,
    PageLayoutModule,
    MatListModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatIconModule,
    IconModule,
    MatButtonModule,
    MatInputModule,

    SetupEnumModule,
  ]
})
export class SetupModule { }
