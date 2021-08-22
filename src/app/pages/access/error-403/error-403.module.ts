import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Error403RoutingModule } from './error-403-routing.module';
import { Error403Component } from './error-403.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';


@NgModule({
  declarations: [Error403Component],
  imports: [
    CommonModule,
    Error403RoutingModule,
    FlexLayoutModule,
    IconModule
  ]
})
export class Error403Module {
}
