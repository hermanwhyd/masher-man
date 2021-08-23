import { Component, Input, OnInit } from '@angular/core';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icClear from '@iconify/icons-ic/round-clear';
import icProduk from '@iconify/icons-ic/outline-shopping-cart';
import icClose from '@iconify/icons-ic/twotone-close';
import icRestore from '@iconify/icons-ic/baseline-restore-from-trash';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import _ from 'lodash';
import { Api } from 'src/app/types/api.interface';
import { PublisherService } from '../services/publisher.service';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@UntilDestroy()
@Component({
  selector: 'vex-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    stagger40ms,
    scaleIn400ms,
    scaleFadeIn400ms
  ],
})
export class PublisherListComponent implements OnInit {

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icClear = icClear;
  icProduk = icProduk;
  icClose = icClose;
  icRestore = icRestore;

  @Input()
  columns: TableColumn<Api>[] = [
    { label: 'Thumbnail', property: 'thumbnailUri', type: 'image', visible: true },
    { label: 'Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Description', property: 'description', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Context', property: 'context', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Version', property: 'version', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Provider', property: 'provider', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'status', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];


  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource: MatTableDataSource<Api> | null;
  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  isLoading = false;
  apisSubject: BehaviorSubject<Api[]> = new BehaviorSubject([]);
  data$: Observable<Api[]> = this.apisSubject.asObservable();
  apis: Api[];

  constructor(
    private snackBar: MatSnackBar,
    private publisherService: PublisherService,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.registerSub();
    this.fetchData();
  }

  registerSub() {
    this.data$.pipe(
      filter<Api[]>(Boolean)
    ).subscribe(models => {
      this.apis = models;
      this.dataSource.data = models;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  fetchData() {
    this.isLoading = true;
    this.publisherService.paginate(0, 25)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(rs => this.apisSubject.next(rs.list));
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    if (value) {
      value = value.trim();
      value = value.toLowerCase();
    }
    this.dataSource.filter = value;
  }
}
