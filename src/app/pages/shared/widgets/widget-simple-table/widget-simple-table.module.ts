import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetSimpleTableComponent } from './widget-simple-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from 'src/app/common/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [WidgetSimpleTableComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  exports: [WidgetSimpleTableComponent]
})
export class WidgetSimpleTableModule { }
