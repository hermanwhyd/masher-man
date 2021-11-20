import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PublisherService } from '../services/publisher.service';

import jmespath from 'jmespath';
import { ApiDetail, EndPointConfig } from 'src/app/types/api.interface';

import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { and, isControl, rankWith, scopeEndsWith } from '@jsonforms/core';
import { ErrorObject } from 'ajv';

import uischemaAsset from 'src/assets/static-data/publisher/uischema-list.json';
import schemaAsset from 'src/assets/static-data/publisher/schema-list.json';
import { BehaviorSubject, of } from 'rxjs';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialogComponent } from 'src/app/utilities/information-dialog/information-dialog.component';
import { delay, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PublisherMasterListService } from '../../shared/controls/services/publisher-master-list.service';
import { ApiDefinitionControlComponent, apiDefinitionTester } from '../../shared/controls/api-definition-control.component';
import { masterDetailTester, MasterListComponent } from '../../shared/controls/master-detail/master-list.component';
import { arrayPrimitiveTester, PublisherArrayPrimitiveControlComponent } from '../../shared/controls/publisher-array-primitive-control.component';
import { PublisherDataDisplayComponent } from '../../shared/controls/publisher-data-display.component';
import { AccountPortalComponent } from '../../shared/controls/account-portal.component';
import { apiTiersTester, PublisherApiTiersControlComponent } from '../../shared/controls/publisher-apitiers-control.component';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@UntilDestroy()
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
export class PublisherEditComponent implements OnInit, AfterViewInit, OnDestroy {
  jmespath = jmespath;

  errorsSubject = new BehaviorSubject<ErrorObject[]>([]);
  draftCountSubject = new BehaviorSubject<number>(0);

  model = { apis: [] as ApiDetail[] };

  isLoading = false;
  hasParamCopyOnly = false;

  uischema = uischemaAsset;
  schema = schemaAsset;

  isDraftValid = new BehaviorSubject<boolean>(false);

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
      renderer: PublisherApiTiersControlComponent,
      tester: rankWith(5, apiTiersTester)
    },
    {
      renderer: PublisherArrayPrimitiveControlComponent,
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
    private route: ActivatedRoute,
    private publisherService: PublisherService,
    private publisherMasterListService: PublisherMasterListService,
    private dialog: MatDialog,
    private loadingSvc: LoadingService) { }

  ngOnDestroy(): void {
    this.publisherService.draftAPIs.next([]);
  }

  ngAfterViewInit(): void {
    this.routerParseParams();
  }

  ngOnInit(): void {
    this.publisherService.draftAPIs$.pipe(untilDestroyed(this))
      .subscribe(data => {
        this.model.apis = data;
      });

    this.listenToLoading();
  }

  routerParseParams() {
    this.hasParamCopyOnly = this.route.snapshot.queryParamMap.has('copyOnly');

    this.route.queryParamMap.pipe(
      untilDestroyed(this),
      map((params: any) => params.getAll('apiIds')),
      distinctUntilChanged(),
      filter<string[]>(Boolean),
    ).subscribe((apiIds: string[]) => {
      apiIds.forEach((apiId) => {
        this.publisherService.getApiDetail(apiId)
          .pipe(
            map((data: any) => {
              if (this.hasParamCopyOnly) {
                delete data.id;
              }

              return data;
            })
          )
          .subscribe(data => {
            const endpointConfig = {} as EndPointConfig;
            try {
              Object.assign(endpointConfig, JSON.parse(data.endpointConfig as string));
              const model = { ...data, endpointConfig };
              this.model.apis.push(model);
            } catch (e) {
              this.model.apis.push(data);
            } finally {
              this.publisherMasterListService.refreshEmit.next('R');
            }
          });
      });
    });
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
    this.publisherMasterListService.publishEmit.next([]);
  }

  listenToLoading(): void {
    this.loadingSvc.loadingSub
      .pipe(delay(0))
      .subscribe((loading) => {
        this.isLoading = loading;
      });
  }
}
