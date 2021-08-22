import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import icHelp from '@iconify/icons-ic/help-outline';
import { scaleInOutAnimation } from 'src/@vex/animations/scale-in-out.animation';

import { ChartComponent } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexPlotOptions,
  ApexGrid,
  ApexLegend,
} from 'ng-apexcharts';
import { ViewChild } from '@angular/core';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  grid: ApexGrid,
  legend: ApexLegend,
  labels: any;
};

@Component({
  selector: 'vex-widget-quick-chart',
  templateUrl: './widget-quick-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleInOutAnimation]
})
export class WidgetQuickChartComponent implements OnInit {

  @Input() isLoading = false;
  @Input() label: string;
  @Input() helpText: string;

  @ViewChild('chart') chart: ChartComponent;
  @Input() public chartOptions: Partial<ChartOptions>;

  icHelp = icHelp;

  constructor() {
  }

  ngOnInit() {
  }
}
