import { Component, ViewChild } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

import icGlobe from '@iconify/icons-fa-solid/globe';
import icStore from '@iconify/icons-ic/outline-shopping-cart';
import icTraining from '@iconify/icons-ic/baseline-model-training';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Profile } from 'src/app/types/api-config.interface';
import { ApiDetail } from 'src/app/types/api.interface';
import { PublisherMasterListService } from './services/publisher-master-list.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'vex-publisher-data-display',
  template: `
    <div *ngIf="api?.id" fxFlexLayout="column" fxLayoutAlign="space-between center" fxFlexLayout.gt-sm="row" fxLayoutGap="8px">
      <a mat-stroked-button color="primary" href="{{activeProfile.portalUrl}}/store/apis/info?name={{api.name}}&version={{api.version}}&provider={{api.provider}}" target="_blank">
        <mat-icon [icIcon]="icGlobe" inline="true" size="20px" class="mr-2"></mat-icon>
        STORE
      </a>
      <a mat-stroked-button color="warn" href="{{activeProfile.portalUrl}}/publisher/info?name={{api.name}}&version={{api.version}}&provider={{api.provider}}" target="_blank">
        <mat-icon [icIcon]="icGlobe" inline="true" size="20px" class="mr-2"></mat-icon>
        PUBLISHER
      </a>

      <span fxFlex></span>

      <a *ngIf="this.isEnabled()" color="primary" mat-mini-fab matTooltip="Publisher View" [routerLink]="['/publisher/list']"
        [queryParams]="{apiId: api?.id}">
        <mat-icon [icIcon]="icTraining" size="20px"></mat-icon>
      </a>
      <a *ngIf="this.isEnabled()" color="primary" mat-mini-fab matTooltip="Store View" [routerLink]="['/store/list']"
        [queryParams]="{apiId: api?.id}">
        <mat-icon [icIcon]="icStore" size="20px"></mat-icon>
      </a>
      <button *ngIf="this.isEnabled()" mat-raised-button color="primary" (click)="createCopy()">MAKE A COPY</button>
    </div>
  `,
  styles: []
})
export class AccountPortalComponent extends JsonFormsControl {
  icGlobe = icGlobe;
  icTraining = icTraining;
  icStore = icStore;

  api: ApiDetail;
  options = new JsonEditorOptions();
  activeProfile: Profile;

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  constructor(
    jsonFormsAngularService: JsonFormsAngularService,
    private publisherMasterListService: PublisherMasterListService,
    private apiConfigService: ApiConfigService,
    private dialog: MatDialog) {
    super(jsonFormsAngularService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.apiConfigService.profiles$.subscribe(p => {
      this.activeProfile = p.find(f => f.active === true);
    });
  }

  public mapAdditionalProps(props: ControlProps) {
    this.api = props.data;
  }

  public createCopy() {
    this.publisherMasterListService.createEmit.next({ ...this.api, id: null });
  }

}
