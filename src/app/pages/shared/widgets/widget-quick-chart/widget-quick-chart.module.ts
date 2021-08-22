import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetQuickChartComponent } from './widget-quick-chart.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [WidgetQuickChartComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    IconModule,
    MatTooltipModule,
    MatButtonModule,
    MatProgressBarModule,
    NgApexchartsModule
  ],
  exports: [WidgetQuickChartComponent]
})
export class WidgetQuickChartModule {
}

