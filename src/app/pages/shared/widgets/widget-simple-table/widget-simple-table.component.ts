import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import icSearch from '@iconify/icons-ic/twotone-search';

import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import jmespath from 'jmespath';

@UntilDestroy()
@Component({
  selector: 'vex-widget-simple-table',
  templateUrl: './widget-simple-table.component.html',
  styleUrls: ['./widget-simple-table.component.scss']
})
export class WidgetSimpleTableComponent<T> implements OnInit, OnChanges, AfterViewInit {

  jmespath = jmespath;

  @Input() title = 'NO TITLE';
  @Input() isLoading = false;
  @Input() data: T[];
  @Input() columns: TableColumn<T>[];
  @Input() pageSize = 6;

  visibleColumns: Array<keyof T | string>;
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  icSearch = icSearch;

  searchCtrl = new FormControl();

  constructor() { }

  ngOnInit() {
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.visibleColumns = this.columns.map(column => column.property);
    }

    if (changes.data) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }
}
