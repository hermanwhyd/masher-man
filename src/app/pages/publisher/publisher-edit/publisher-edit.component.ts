import { Component, OnInit } from '@angular/core';
import { PublisherService } from '../services/publisher.service';

import jmespath from 'jmespath';
import { ApiDetail } from 'src/app/types/api.interface';

import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { and, isControl, or, rankWith, schemaTypeIs, scopeEndsWith, Tester, uiTypeIs } from '@jsonforms/core';
import { ErrorObject } from 'ajv';

import { PublisherDataDisplayComponent } from './controls/publisher-data-display.component';

import uischemaAsset from 'src/assets/static-data/publisher/uischema-list.json';
import schemaAsset from 'src/assets/static-data/publisher/schema-list.json';
import { PublisherArrayControlComponent } from './controls/publisher-array-control.component';
import { BehaviorSubject } from 'rxjs';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { masterDetailTester, MasterListComponent } from './controls/master-detail/master-list.component';

const arrayPrimitiveTester: Tester = or(
  and(
    schemaTypeIs('array'),
    scopeEndsWith('accessControlAllowMethods')
  ),
  and(
    schemaTypeIs('array'),
    scopeEndsWith('accessControlAllowHeaders')
  ),
  and(
    schemaTypeIs('array'),
    scopeEndsWith('tags')
  )
);

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@Component({
  selector: 'vex-publisher-edit',
  templateUrl: './publisher-edit.component.html',
  styleUrls: ['./publisher-edit.component.scss'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    }
  ]
})
export class PublisherEditComponent implements OnInit {
  jmespath = jmespath;

  errors: ErrorObject[];
  draftAPIs = [] as ApiDetail[];
  model = { apis: [] as ApiDetail[] };

  uischema = uischemaAsset;
  schema = schemaAsset;

  isDraftValid = new BehaviorSubject<boolean>(false);

  renderers = [
    ...angularMaterialRenderers,
    {
      renderer: MasterListComponent,
      tester: masterDetailTester
    },
    {
      renderer: PublisherArrayControlComponent,
      tester: rankWith(5, arrayPrimitiveTester)
    },
    {
      renderer: PublisherDataDisplayComponent,
      tester: rankWith(6, and(isControl, scopeEndsWith('___data')))
    }
  ];

  constructor(private publiserService: PublisherService) { }

  ngOnInit(): void {
    this.publiserService.draftAPIs$.subscribe(data => {
      this.model.apis = data;
    });
  }

  onChange(event: any) {
    this.draftAPIs = event.apis;
  }

  onError(event: ErrorObject[]) {
    this.errors = event;
  }
}
