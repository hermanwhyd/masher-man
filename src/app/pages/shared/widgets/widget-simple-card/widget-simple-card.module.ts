import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetSimpleCardComponent } from './widget-simple-card.component';
import { SharedModule } from 'src/app/common/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [WidgetSimpleCardComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  exports: [WidgetSimpleCardComponent]
})
export class WidgetSimpleCardModule { }
