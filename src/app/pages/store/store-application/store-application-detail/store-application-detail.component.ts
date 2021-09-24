import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import icArrowBack from '@iconify/icons-ic/twotone-arrow-back';
import icPencil from '@iconify/icons-ic/edit';
import icSearch from '@iconify/icons-ic/twotone-search';
import icClear from '@iconify/icons-ic/round-clear';

import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import uischemaAsset from 'src/assets/static-data/application/uischema.json';
import schemaAsset from 'src/assets/static-data/application/schema.json';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { statusClass } from 'src/app/utilities/function/api-status';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { rankWith } from '@jsonforms/core';
import { ApiDefinitionControlComponent, apiDefinitionTester } from 'src/app/pages/shared/controls/api-definition-control.component';
import { arrayPrimitiveTester, PublisherArrayPrimitiveControlComponent } from 'src/app/pages/shared/controls/publisher-array-primitive-control.component';
import { StoreService } from '../../services/store.service';
import { arrayEndpointUrlTester, PublisherEndpointUrlControlComponent } from 'src/app/pages/shared/controls/publisher-endpointurl-control.component';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Application } from 'src/app/types/application.interface';
import { Subscription } from 'src/app/types/subscription.interface';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { SubscriptionService } from '../../services/subscription.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@UntilDestroy()
@Component({
  selector: 'vex-store-application-detail',
  templateUrl: './store-application-detail.component.html',
  styleUrls: ['./store-application-detail.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    stagger40ms,
    scaleIn400ms,
    scaleFadeIn400ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    }
  ]
})
export class StoreApplicationDetailComponent implements OnInit {

  icArrowBack = icArrowBack;
  icPencil = icPencil;
  icClear = icClear;

  @Output() addOrUpdateModel = new EventEmitter<Application>();

  codec = new HttpUrlEncodingCodec();

  model: Application;
  subscriptionsSubject = new BehaviorSubject<Subscription[]>([]);
  subscriptionsFiltered: Subscription[] = [];

  isLoading = true;
  isSwaggerLoaded = false;

  statusClass = statusClass;

  options = new JsonEditorOptions();
  isShowJsonRaw = false;

  icSearch = icSearch;
  searchCtrl = new FormControl();
  isAdvancedSrc = true;

  uischema = uischemaAsset;
  schema = schemaAsset;
  renderers = [
    ...angularMaterialRenderers,
    {
      renderer: ApiDefinitionControlComponent,
      tester: apiDefinitionTester
    },
    {
      renderer: PublisherArrayPrimitiveControlComponent,
      tester: rankWith(5, arrayPrimitiveTester)
    },
    {
      renderer: PublisherEndpointUrlControlComponent,
      tester: rankWith(5, arrayEndpointUrlTester)
    }
  ];

  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement>;
  constructor(
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigService,
    private dialog: MatDialog,
    private storeService: StoreService,
    private subscriptionService: SubscriptionService) {
    this.options.mode = 'code';
    this.options.modes = ['code', 'tree'];
  }

  ngOnInit(): void {
    this.searchCtrl.valueChanges.pipe(
      debounceTime(250),
      untilDestroyed(this)
    ).subscribe(() => this.refreshSubscriptionsFiltered());

    this.subscriptionsSubject.asObservable().subscribe(() => this.refreshSubscriptionsFiltered());

    this.route.queryParamMap.pipe(
      untilDestroyed(this),
      map((params: any) => params.get('appId')),
      distinctUntilChanged(),
      filter<string>(Boolean),
      switchMap(appId => this.storeService.getApplicationDetail(appId).pipe(finalize(() => this.isLoading = false)))
    ).subscribe((data: Application) => {
      this.model = data;
    });
  }

  togleJsonView(change: MatSlideToggleChange) {
    this.isShowJsonRaw = change.checked;
  }

  fetchSubscriptions() {
    this.isLoading = true;
    this.subscriptionService.getSubscriptions(0, 1000, this.model?.applicationId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(rs => {
        this.subscriptionsSubject.next(rs.list);
      });
  }

  tabChange(index: number) {
    if (index === 2 && this.subscriptionsFiltered.length === 0) {
      this.fetchSubscriptions();
    }
  }

  subscribe(item: Subscription) {
    this.subscriptionService.subscribe([item]).subscribe((rs) => {
      const models = this.subscriptionsSubject.value;
      models.push(rs[0]);
      this.subscriptionsSubject.next(models);
    });
  }

  approve(item: Subscription) {
    this.subscriptionService.approve(item.subscriptionId).subscribe((rs) => {
      const models = this.subscriptionsSubject.value;
      const idx = models.indexOf(item);
      models[idx] = rs;
      this.subscriptionsSubject.next(models);
    });
  }

  unsubscribe(item: Subscription) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Are you sure you want to unsubscribe API <b>${this.codec.decodeValue(item.apiIdentifier)}</b>?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.subscriptionService.unsubscribe(item.subscriptionId).subscribe(() => {
          const models = this.subscriptionsSubject.value;
          models.splice(models.indexOf(item), 1);
          this.subscriptionsSubject.next(models);
        });
      }
    });
  }

  refreshSubscriptionsFiltered() {
    const value = this.searchCtrl.value || '';
    this.subscriptionsFiltered = this.subscriptionsSubject.value.filter(
      s => s.apiIdentifier.toLowerCase().includes(value.trim().toLowerCase())
    );

    if (this.isAdvancedSrc && value !== '') {
      this.storeService.paginate(0, 8, value).subscribe(rs => {
        let count = 0;
        rs.list.forEach((item) => {
          const apiIdentifier = [item.provider, item.name.replace('-', '%2D'), item.version].join('-');
          if (count < 5 && !this.subscriptionsSubject.value.some(s => s.apiIdentifier === apiIdentifier)) {
            this.subscriptionsFiltered.push({ apiIdentifier, tier: this.model.throttlingTier, applicationId: this.model.applicationId });
            count++;
          }
        });
      });
    }
  }

  onAdvancedSearchTogle(change: MatSlideToggleChange) {
    this.isAdvancedSrc = change.checked;
  }
}
