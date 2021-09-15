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

import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import uischemaAsset from 'src/assets/static-data/publisher/uischema.json';
import schemaAsset from 'src/assets/static-data/publisher/schema.json';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { statusClass } from 'src/app/utilities/function/api-status';

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

  uischema = uischemaAsset;
  schema = schemaAsset;
  angularMaterialRenderers = angularMaterialRenderers;

  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement>;
  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService) { }

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

      // swagger initialize
      SwaggerUIBundle({
        domNode: this.swaggerDom.nativeElement,
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        operationsSorter: 'alpha',
        layout: 'BaseLayout',
        spec: JSON.parse(this.model.apiDefinition),
      });

      delete (this.model.apiDefinition);
    });
  }
}
