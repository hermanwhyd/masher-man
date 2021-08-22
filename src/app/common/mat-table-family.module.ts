import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

const MODULES = [
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MatTableFamilyModule { }
