import { Component, Input, OnInit, ViewChild } from '@angular/core';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icClear from '@iconify/icons-ic/round-clear';
import icFolder from '@iconify/icons-ic/baseline-snippet-folder';
import icClose from '@iconify/icons-ic/twotone-close';
import icRestore from '@iconify/icons-ic/baseline-restore-from-trash';
import icGlobe from '@iconify/icons-fa-solid/globe';
import icRemove from '@iconify/icons-ic/outline-remove-circle-outline';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import { filter, finalize, map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { ActivatedRoute } from '@angular/router';
import { statusClass } from 'src/app/utilities/function/api-status';
import icFolderPlush from '@iconify/icons-fa-solid/folder-plus';
import { Application } from 'src/app/types/application.interface';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { StoreApplicationEditComponent } from './store-application-edit/store-application-edit.component';
import { Profile } from 'src/app/types/api-config.interface';
import { ApplicationService } from 'src/app/services/application.service';

@UntilDestroy()
@Component({
  selector: 'vex-store-application',
  templateUrl: './store-application.component.html',
  styleUrls: ['./store-application.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    stagger40ms,
    scaleIn400ms,
    scaleFadeIn400ms
  ],
})
export class StoreApplicationComponent implements OnInit {

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icClear = icClear;
  icFolder = icFolder;
  icClose = icClose;
  icRestore = icRestore;
  icGlobe = icGlobe;
  icFolderPlush = icFolderPlush;
  icRemove = icRemove;

  @Input()
  columns: TableColumn<Application>[] = [
    { label: 'Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Description', property: 'description', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Tier', property: 'throttlingTier', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Subscriber', property: 'subscriber', type: 'text', visible: false, cssClasses: ['font-medium'] },
    { label: 'Status', property: 'status', type: 'status', visible: true, cssClasses: ['text-secondary', 'font-medium'] }
  ];

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource: MatTableDataSource<Application> | null;
  searchCtrl = new FormControl();

  statusClass = statusClass;

  isLoading = false;
  appsSubject: BehaviorSubject<Application[]> = new BehaviorSubject([]);
  data$: Observable<Application[]> = this.appsSubject.asObservable();

  activeProfile: Profile;

  isLoadApiDetail = new BehaviorSubject<boolean>(false);

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apiConfigService: ApiConfigService,
    private applicationService: ApplicationService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.registerSub();
    this.fetchData();
  }

  registerSub() {
    this.data$.pipe(
      filter<Application[]>(Boolean)
    ).subscribe(models => {
      this.dataSource.data = models;
    });

    this.route.queryParamMap.pipe(
      map((params: any) => params.has('appId')),
    ).subscribe((has) => this.isLoadApiDetail.next(has));

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
    this.applicationService.getApplications()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(rs => {
        this.appsSubject.next(rs.list);
      }, (error) => {
        this.appsSubject.next([] as Application[]);
        this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: `${error}. F12 for more detail!`, type: 'danger' } });
      });
  }

  toggleColumnVisibility(column: any, event: any) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value?.trim() || '';
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  addOrUpdateModel(model?: Application) {
    this.dialog.open(StoreApplicationEditComponent, {
      data: model || {} as Application,
      width: '600px',
      disableClose: true
    })
      .afterClosed().subscribe((newModel: Application) => {
        if (!newModel) { return; }

        const models = this.appsSubject.value;
        if (!model) {
          models.push(newModel);
        } else {
          const idx = models.indexOf(model);
          models[idx] = newModel;
        }

        this.appsSubject.next(models);
        this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: `Application has been saved successfully`, type: 'success' } });
      });
  }
}
