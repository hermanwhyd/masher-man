import { Component, OnInit } from '@angular/core';
import { PublisherService } from '../services/publisher.service';

import jmespath from 'jmespath';
import { ApiDetail } from 'src/app/types/api.interface';

import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { and, isControl, or, rankWith, schemaTypeIs, scopeEndsWith, Tester } from '@jsonforms/core';
import { ErrorObject } from 'ajv';

import { PublisherDataDisplayComponent } from './controls/publisher-data-display.component';

import uischemaAsset from 'src/assets/static-data/publisher/uischema-list.json';
import schemaAsset from 'src/assets/static-data/publisher/schema-list.json';
import { PublisherArrayControlComponent } from './controls/publisher-array-control.component';
import { BehaviorSubject } from 'rxjs';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { masterDetailTester, MasterListComponent } from './controls/master-detail/master-list.component';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialogComponent } from 'src/app/utilities/information-dialog/information-dialog.component';
import { ApiDefinitionControlComponent, apiDefinitionTester } from './controls/api-definition-control.component';
import { AccountPortalComponent } from './controls/account-portal.component';
import { delay } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading-service.service';

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

  errorsSubject = new BehaviorSubject<ErrorObject[]>([]);
  draftCountSubject = new BehaviorSubject<number>(0);

  model = { apis: [] as ApiDetail[] };

  uischema = uischemaAsset;
  schema = schemaAsset;

  isDraftValid = new BehaviorSubject<boolean>(false);
  isPublishing = false;

  renderers = [
    ...angularMaterialRenderers,
    {
      renderer: ApiDefinitionControlComponent,
      tester: apiDefinitionTester
    },
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
    },
    {
      renderer: AccountPortalComponent,
      tester: rankWith(6, and(isControl, scopeEndsWith('___portal')))
    }
  ];

  constructor(
    private publiserService: PublisherService,
    private dialog: MatDialog,
    private loadingSvc: LoadingService) { }

  ngOnInit(): void {
    this.publiserService.draftAPIs$.subscribe(data => {
      this.model.apis = data;
    });

    this.listenToLoading();
  }

  onChange(event) {
    this.draftCountSubject.next(event.apis?.length || 0);
  }

  onError(event: ErrorObject[]) {
    this.errorsSubject.next(event);
  }

  validate() {
    this.dialog.open(InformationDialogComponent, {
      data: {
        message: `<pre>${JSON.stringify(this.errorsSubject.value, null, 2)}</pre>`,
        buttonText: {
          cancel: 'Close'
        }
      }
    });
  }

  publish() {
    this.publiserService.publishAllEmit.next([]);
  }

  listenToLoading(): void {
    this.loadingSvc.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.isPublishing = loading;
      });
  }
}
