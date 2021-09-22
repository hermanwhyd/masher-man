import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import icArrowBack from '@iconify/icons-ic/twotone-arrow-back';
import icPencil from '@iconify/icons-ic/edit';

import { ApiDetail, EndPointConfig } from 'src/app/types/api.interface';
import { ActivatedRoute } from '@angular/router';
import { catchError, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import uischemaAsset from 'src/assets/static-data/store/uischema.json';
import schemaAsset from 'src/assets/static-data/store/schema.json';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { statusClass } from 'src/app/utilities/function/api-status';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { and, isControl, rankWith, scopeEndsWith } from '@jsonforms/core';
import { ApiDefinitionControlComponent, apiDefinitionTester } from 'src/app/pages/shared/controls/api-definition-control.component';
import { arrayPrimitiveTester, PublisherArrayPrimitiveControlComponent } from 'src/app/pages/shared/controls/publisher-array-primitive-control.component';
import { AccountPortalComponent } from 'src/app/pages/shared/controls/account-portal.component';
import { StoreService } from '../../services/store.service';
import { arrayEndpointUrlTester, PublisherEndpointUrlControlComponent } from 'src/app/pages/shared/controls/publisher-endpointurl-control.component';
import { PublisherService } from 'src/app/pages/publisher/services/publisher.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { forkJoin, of, throwError } from 'rxjs';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@UntilDestroy()
@Component({
  selector: 'vex-store-list-detail',
  templateUrl: './store-list-detail.component.html',
  styleUrls: ['./store-list-detail.component.scss'],
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
export class StoreListDetailComponent implements OnInit {

  icArrowBack = icArrowBack;
  icPencil = icPencil;
  model: ApiDetail;
  isLoading = true;
  isSwaggerLoaded = false;

  statusClass = statusClass;

  options = new JsonEditorOptions();
  isShowJsonRaw = false;

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
    },
    {
      renderer: AccountPortalComponent,
      tester: rankWith(6, and(isControl, scopeEndsWith('___portal')))
    }
  ];

  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement>;
  constructor(
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigService,
    private storeService: StoreService,
    private publisherService: PublisherService) {
    this.options.mode = 'code';
    this.options.modes = ['code', 'tree'];
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      untilDestroyed(this),
      map((params: any) => params.get('apiId')),
      distinctUntilChanged(),
      filter<string>(Boolean),
      switchMap(apiId => {
        if (this.apiConfigService.getActivePublisher() != null) {
          return forkJoin({
            publisher: this.publisherService.getApiDetail(apiId).pipe(catchError(error => throwError(error))),
            store: this.storeService.getApiDetail(apiId).pipe(catchError(error => throwError(error)))
          })
            .pipe(
              finalize(() => this.isLoading = false),
              switchMap(({ publisher, store }) => {
                const apis: ApiDetail = { ...publisher, ...store };
                return of(apis);
              }
              )
            );
        } else {
          return this.storeService.getApiDetail(apiId).pipe(finalize(() => this.isLoading = false));
        }
      })
    ).subscribe((data: ApiDetail) => {
      try {
        const endpointConfig = {} as EndPointConfig;
        Object.assign(endpointConfig, JSON.parse(data.endpointConfig as string));
        this.model = { ...data, endpointConfig };
      } catch (e) {
        this.model = data;
      }
    }, error => console.log(error));
  }

  togleJsonView(change: MatSlideToggleChange) {
    this.isShowJsonRaw = change.checked;
  }
}
