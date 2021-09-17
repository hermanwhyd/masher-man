import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import icArrowBack from '@iconify/icons-ic/twotone-arrow-back';
import icPencil from '@iconify/icons-ic/edit';

import { ApiDetail, EndPointConfig } from 'src/app/types/api.interface';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { PublisherService } from '../../services/publisher.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from 'src/@vex/animations/scale-fade-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';

import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import uischemaAsset from 'src/assets/static-data/publisher/uischema.json';
import schemaAsset from 'src/assets/static-data/publisher/schema.json';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { statusClass } from 'src/app/utilities/function/api-status';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ApiDefinitionControlComponent, apiDefinitionTester } from '../../publisher-edit/controls/api-definition-control.component';
import { PublisherArrayControlComponent, arrayPrimitiveTester } from '../../publisher-edit/controls/publisher-array-control.component';
import { AccountPortalComponent } from '../../publisher-edit/controls/account-portal.component';
import { and, isControl, rankWith, scopeEndsWith } from '@jsonforms/core';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@UntilDestroy()
@Component({
  selector: 'vex-publisher-list-detail',
  templateUrl: './publisher-list-detail.component.html',
  styleUrls: ['./publisher-list-detail.component.scss'],
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
export class PublisherListDetailComponent implements OnInit {

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
      renderer: PublisherArrayControlComponent,
      tester: rankWith(5, arrayPrimitiveTester)
    },
    {
      renderer: AccountPortalComponent,
      tester: rankWith(6, and(isControl, scopeEndsWith('___portal')))
    }
  ];

  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement>;
  constructor(
    private route: ActivatedRoute,
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
      switchMap(apiId => this.publisherService.getApiDetail(apiId).pipe(finalize(() => this.isLoading = false)))
    ).subscribe((data: ApiDetail) => {
      try {
        const endpointConfig = {} as EndPointConfig;
        Object.assign(endpointConfig, JSON.parse(data.endpointConfig as string));
        this.model = { ...data, endpointConfig };
      } catch (e) {
        this.model = data;
      }
    });
  }

  togleJsonView(change: MatSlideToggleChange) {
    this.isShowJsonRaw = change.checked;
  }
}
