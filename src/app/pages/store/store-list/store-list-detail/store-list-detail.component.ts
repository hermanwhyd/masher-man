import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import icArrowBack from '@iconify/icons-ic/twotone-arrow-back';
import icPencil from '@iconify/icons-ic/edit';
import icFile from '@iconify/icons-fa-solid/file-code';
import icTraining from '@iconify/icons-ic/baseline-model-training';

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
import { Subscription } from 'src/app/types/subscription.interface';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionService } from '../../../../services/subscription.service';
import { Application, Key } from 'src/app/types/application.interface';
import { MarkdownDialogComponent } from 'src/app/utilities/markdown-dialog/markdown-dialog.component';
import { upperCase } from 'lodash';
import * as queryString from 'query-string';

import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

import { CurlGenerator } from 'curl-generator';
import { ApplicationService } from 'src/app/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { FormBuilder } from '@angular/forms';
import { Resolver } from '@stoplight/json-ref-resolver';
import { AuthService } from 'src/app/pages/access/auth-manager/services/auth.service';
import * as Converter from 'api-spec-converter';

import jsf from 'json-schema-faker';

const jsonRefResolver = new Resolver();
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
export class StoreListDetailComponent implements OnInit, AfterViewInit {

  icArrowBack = icArrowBack;
  icPencil = icPencil;
  icFile = icFile;
  icTraining = icTraining;

  model: ApiDetail;

  // subscription tab
  subscribers = [] as Subscription[];
  applications = [] as Application[];

  // Api Console tab
  isLoadingToken = false;
  isAuthUsingApiKey = false;
  keyTypes: string[] = ['PRODUCTION', 'SANDBOX'];
  formConsole = this.fb.group({
    applicationId: [],
    keyType: this.keyTypes[0],
    authKey: [{ value: '', disabled: true }]
  });

  isLoading = true;
  swaggerUIBundle: SwaggerUIBundle;

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

  @ViewChild('swaggerConsole') swaggerDom: ElementRef<HTMLDivElement>;
  constructor(
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigService,
    private storeService: StoreService,
    private applicationService: ApplicationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private publisherService: PublisherService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.options.mode = 'code';
    this.options.modes = ['code', 'tree'];
  }

  ngAfterViewInit(): void {
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
    });

    this.route.queryParamMap.pipe(
      untilDestroyed(this),
      map((params: any) => params.get('apiIdentifier')),
      distinctUntilChanged(),
      filter<string>(Boolean),
      switchMap(apiIdentifier => {
        apiIdentifier = apiIdentifier.split('%252D').join('%2D');
        if (this.apiConfigService.getActivePublisher() != null) {
          return forkJoin({
            publisher: this.publisherService.getApiDetail(apiIdentifier).pipe(catchError(error => throwError(error))),
            store: this.storeService.getApiDetail(apiIdentifier).pipe(catchError(error => throwError(error)))
          })
            .pipe(
              finalize(() => this.isLoading = false),
              switchMap(({ publisher, store }) => {
                const apis: ApiDetail = { ...publisher, ...store };
                return of(apis);
              })
            );
        } else {
          return this.storeService.getApiDetail(apiIdentifier).pipe(finalize(() => this.isLoading = false));
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
    });
  }

  async initSwagger() {
    const resolved = await jsonRefResolver.resolve(JSON.parse(this.model.apiDefinition));
    const apiDef = JSON.parse(JSON.stringify(resolved.result));

    const finalHost = this.model.endpointURLs[0]?.environmentURLs.https || this.model.endpointURLs[0]?.environmentURLs.http;
    const finalHostUrl = new URL(finalHost);
    const proxyHost = [this.apiConfigService.getApiUrl(), '/proxy', finalHost.split(finalHostUrl.host).pop()].join('');
    const servers = [
      { url: finalHost, description: 'API endpoint URL' },
      { url: proxyHost, description: 'Using Proxy Host' }
    ];

    let securitySchemes: any = { authKey: { type: 'http', scheme: 'bearer' } };
    const security: any = [{ authKey: [] }];

    if (this.model.name.endsWith('_CLIENTIDAUTH')) {
      securitySchemes = { authKey: { type: 'apiKey', in: 'query', name: 'API_KEY' } };
      this.isAuthUsingApiKey = true;
    }

    let apiDefinitionSwagger: any = {};

    if (apiDef.swagger) {
      const converted: any = await Converter.convert({ from: 'swagger_2', to: 'openapi_3', source: apiDef });
      const convertedSpec = JSON.parse(JSON.stringify(converted.spec));
      apiDefinitionSwagger = {
        ...convertedSpec,
        ...{
          servers,
          components: { securitySchemes }
        }
      };
    } else {
      apiDefinitionSwagger = {
        ...apiDef,
        ...{
          servers,
          components: { securitySchemes }
        }
      };
    }

    Object.values(apiDefinitionSwagger.paths).forEach(p => {
      Object.values(p).forEach(op => {
        op.security = security;
      });
    });

    this.swaggerUIBundle = SwaggerUIBundle({
      domNode: this.swaggerDom.nativeElement,
      deepLinking: false,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      spec: apiDefinitionSwagger,
      operationsSorter: 'alpha',
      displayRequestDuration: true,
      requestInterceptor: (request: any) => {
        if (request.url.includes('/*')) {
          request.url = request.url.replace('/*', '');
        }

        request.headers['Content-Type'] = request.headers['Content-Type'] || 'application/json';
        request.headers.accept = (request.headers.accept === '*/*') ? request.headers['Content-Type'] : request.headers.accept;

        if (request.url.startsWith(proxyHost)) {
          request.headers['target-url'] = request.url.replace(proxyHost, finalHost);
        }

        return request;
      }
    });
  }

  togleJsonView(change: MatSlideToggleChange) {
    this.isShowJsonRaw = change.checked;
  }

  tabChange(index: number) {
    // subscription & apiconsole tab
    if (index >= 2 && this.subscribers.length === 0) {
      forkJoin({
        callApps: this.applicationService.getApplications(),
        callSubs: this.subscriptionService.getApiSubscriber(this.model?.id)
      })
        .pipe(
          finalize(() => this.isLoading = false),
          switchMap(({ callApps, callSubs }) => {
            this.applications = callApps.list;
            const subs: Subscription[] = [];
            callApps.list?.forEach(app => {
              let sub = callSubs.list?.find(s => s.applicationId === app.applicationId);
              if (!sub) {
                sub = { apiIdentifier: this.model.id, tier: app.throttlingTier, applicationId: app.applicationId };
              }
              subs.push(sub);
            });
            return of(subs);
          })
        ).subscribe((rs) => {
          this.subscribers = rs;
          this.initSwagger();
        });
    }
  }

  get subscriberApi() {
    return this.subscribers.filter(s => s.status === 'UNBLOCKED');
  }

  subscribe(item: Subscription) {
    this.subscriptionService.subscribe([item]).subscribe((rs) => {
      const models = this.subscribers;
      const idx = models.indexOf(item);
      models[idx] = rs[0];
      this.snackBar.openFromComponent(
        SnackbarNotifComponent,
        { data: { message: 'APIs subscription success, pending for approval via manage-service portal!', type: 'success' } }
      );
    });
  }

  approve(item: Subscription) {
    this.subscriptionService.approve(item.subscriptionId).subscribe((rs) => {
      const models = this.subscribers;
      const idx = models.indexOf(item);
      models[idx] = rs;
    });
  }

  unsubscribe(item: Subscription) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Are you sure you want to remove selected application subscription?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.subscriptionService.unsubscribe(item.subscriptionId).subscribe(() => {
          const models = this.subscribers;
          const idx = models.indexOf(item);
          delete models[idx].status;
          delete models[idx].subscriptionId;
        });
      }
    });
  }

  getApplicationName(appId: string) {
    return this.applications.find(app => app.applicationId === appId)?.name || appId;
  }

  public async createDocs() {
    // header
    const apiSpec: any = [
      { h1: this.model.name },
      { p: this.model.description || '' }
    ];

    // contents
    let openapi3 = JSON.parse(this.model.apiDefinition);
    if (openapi3.swagger) {
      const converted: any = await Converter.convert({ from: 'swagger_2', to: 'openapi_3', source: openapi3 });
      openapi3 = JSON.parse(JSON.stringify(converted.spec));
    }
    const resolved = await jsonRefResolver.resolve(openapi3);
    const apiDefinition = JSON.parse(JSON.stringify(resolved.result));

    apiSpec.push({ h2: 'API Reference' });

    for (const [path, methods] of Object.entries(apiDefinition.paths)) {
      for (const [method, value] of Object.entries(methods)) {
        apiSpec.push({ h3: value.summary || 'Default' });
        apiSpec.push({ code: { language: 'typescript', content: `${method} ${path}` } });

        // construct http param and header
        let httpBody: any = null;
        const httpParams: any = {};
        const httpHeaders: any = {
          'Content-type': (!value.consumes) ? 'application/json' : value.consumes.join(', '),
          Authorization: 'bearer {{access_token}}'
        };

        const rows = [];

        // add parameter
        if (!!value.parameters) {
          value.parameters.forEach(p => {
            const row = [p.name || '', p.description || '', p.in || '', p.schema?.type || '', String(p.required || 'false')];

            if (p.in === 'query') {
              httpParams[p.name] = p.name;
            }

            if (p.in === 'header') {
              httpHeaders[p.name] = `{{${p.name}}}`;
            }

            rows.push(row);
          });
        }

        // payload Request
        if (value.requestBody) {
          const payloadSchema = value.requestBody.content['application/json']?.schema;
          if (payloadSchema) {
            const row = ['payloadRq', 'Request body', 'body', payloadSchema?.type, String(value.requestBody.required || 'false')];
            rows.push(row);

            jsf.option({ fillProperties: false });
            jsf.option({ useExamplesValue: true });
            jsf.option({ alwaysFakeOptionals: true });

            httpBody = jsf.generate(payloadSchema);
          }
        }

        if (rows.length > 0) {
          apiSpec.push({
            table: {
              headers: ['Parameter Name', 'Description', 'Parameter Type', 'Data Type', 'Required'],
              rows: [...rows]
            }
          });
        }

        // add usage example
        const finalHost = this.model.endpointURLs[0]?.environmentURLs.https || this.model.endpointURLs[0]?.environmentURLs.http;
        const finalUrl = queryString.stringifyUrl({ url: path === '/*' ? '' : path, query: httpParams });

        const params: any = {
          url: finalHost + finalUrl,
          method: upperCase(method),
          headers: httpHeaders,
          body: httpBody
        };

        const content: any = CurlGenerator(params);

        apiSpec.push({ h4: 'Usage/Example' });
        apiSpec.push({ code: { language: 'shell', content } });
      }
    }

    // footer
    apiSpec.push({ h2: 'Support' });
    apiSpec.push({ p: 'For support please contact key account manager.' });

    this.dialog.open(MarkdownDialogComponent, {
      data: apiSpec,
      width: '720px'
    });
  }

  generateToken() {
    const form = this.formConsole.getRawValue();
    this.isLoadingToken = true;
    this.applicationService.getKeyDetail(form.applicationId, form.keyType)
      .pipe(
        switchMap((key: Key) => {
          return this.isAuthUsingApiKey
            ? of(key.consumerKey)
            : this.authService.tokenClientCredential(key.consumerKey, key.consumerSecret);
        }))
      .subscribe(authKey => {
        this.isLoadingToken = false;
        this.formConsole.controls.authKey.setValue(authKey);
        this.swaggerUIBundle.preauthorizeApiKey('authKey', authKey);
      }, () => this.isLoadingToken = false);
  }

  get canGenerateToken() {
    return this.formConsole.dirty && this.formConsole.valid;
  }
}
