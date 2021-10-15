import { Component, Input, OnInit } from '@angular/core';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icClear from '@iconify/icons-ic/round-clear';
import icStore from '@iconify/icons-ic/outline-shopping-cart';
import icClose from '@iconify/icons-ic/twotone-close';
import icRestore from '@iconify/icons-ic/baseline-restore-from-trash';
import icInfo from '@iconify/icons-ic/outline-info';
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
import { Api } from 'src/app/types/api.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paginate } from 'src/app/types/paginate.interface';
import { PageEvent } from '@angular/material/paginator';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { ActivatedRoute, Router } from '@angular/router';
import { statusClass } from 'src/app/utilities/function/api-status';
import { StoreService } from '../services/store.service';
import { SelectionModel } from '@angular/cdk/collections';
import icFolderPlush from '@iconify/icons-fa-solid/folder-plus';
import { MatDialog } from '@angular/material/dialog';
import { StoreSubscribeComponent } from '../store-subscribe/store-subscribe.component';
import { Profile } from 'src/app/types/api-config.interface';

@UntilDestroy()
@Component({
  selector: 'vex-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    stagger40ms,
    scaleIn400ms,
    scaleFadeIn400ms
  ],
})
export class StoreListComponent implements OnInit {

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icClear = icClear;
  icStore = icStore;
  icClose = icClose;
  icRestore = icRestore;
  icInfo = icInfo;
  icGlobe = icGlobe;
  icFolderPlush = icFolderPlush;
  icRemove = icRemove;

  @Input()
  columns: TableColumn<Api>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Thumbnail', property: 'thumbnailUri', type: 'image', visible: true },
    { label: 'Name', property: 'name', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Portal', property: 'portal', type: 'button', visible: true },
    { label: 'Version', property: 'version', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Description', property: 'description', type: 'text', visible: false, cssClasses: ['text-secondary'] },
    { label: 'Context', property: 'context', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Provider', property: 'provider', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Status', property: 'status', type: 'status', visible: false, cssClasses: ['text-secondary', 'font-medium'] }
  ];

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pagination: Paginate<Api>;
  pageEventSubject: BehaviorSubject<PageEvent> = new BehaviorSubject(null);
  dataSource: MatTableDataSource<Api> | null;
  searchCtrl = new FormControl();

  statusClass = statusClass;

  selection = new SelectionModel<Api>(true, []);

  isLoading = false;
  apisSubject: BehaviorSubject<Api[]> = new BehaviorSubject([]);
  data$: Observable<Api[]> = this.apisSubject.asObservable();
  profiles$ = this.apiConfigService.profiles$;
  activeProfile: Profile;

  isLoadApiDetail = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apiConfigService: ApiConfigService,
    private storeService: StoreService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.registerSub();
  }

  registerSub() {
    this.data$.pipe(
      filter<Api[]>(Boolean)
    ).subscribe(models => {
      this.dataSource.data = models;
    });

    this.pageEventSubject
      .asObservable()
      .pipe(filter<PageEvent>(Boolean))
      .subscribe(event => {
        this.storeService.paginate((event.pageIndex * event.pageSize), event.pageSize, this.searchCtrl.value)
          .subscribe((rs) => {
            this.pagination = rs;
            this.apisSubject.next(rs.list);
          });
      });

    this.profiles$.pipe(untilDestroyed(this)).subscribe(() => {
      this.fetchData();
      this.activeProfile = this.apiConfigService.getActiveProfile();
    });

    this.route.queryParamMap.pipe(
      map((params: any) => params.has('apiId') || params.has('apiIdentifier')),
    ).subscribe((has) => this.isLoadApiDetail.next(has));
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  refreshDataPaging(event: PageEvent): void {
    this.pageEventSubject.next(event);
  }

  fetchData() {
    this.isLoading = true;
    this.storeService.paginate(0, 10)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(rs => {
        this.pagination = rs;
        this.apisSubject.next(rs.list);
      }, (error) => {
        this.pagination = null;
        this.apisSubject.next([] as Api[]);
        this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: `${error}. F12 for more detail!`, type: 'danger' } });
      });
  }

  toggleColumnVisibility(column: any, event: any) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  onSearch() {
    const pageEvent = this.pageEventSubject.value
      || ({ pageIndex: 1, pageSize: 10, length: this.pagination?.pagination.total || 10 } as PageEvent);
    pageEvent.pageIndex = 0;
    this.pageEventSubject.next(pageEvent);
  }

  getPortalLink(api: Api) {
    return `${this.apiConfigService.getActiveProfile()?.portalUrl}/store/apis/info?name=${api.name}&version=${api.version}&provider=${api.provider}`;
  }

  subscribes(apis: Api[]) {
    this.dialog.open(StoreSubscribeComponent, {
      data: apis,
      width: '600px',
      disableClose: true
    });
  }

  batchEdit(apis: Api[]) {
    const ids: Api['id'][] = [];
    apis.forEach(a => ids.push(a.id));
    this.router.navigate(['/publisher/edit'], { relativeTo: this.route, queryParams: { apiIds: ids } });
  }
}
