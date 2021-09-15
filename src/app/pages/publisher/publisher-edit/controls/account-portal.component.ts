import { Component, ViewChild } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';
import icGlobe from '@iconify/icons-fa-solid/globe';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Profile } from 'src/app/types/api-config.interface';

@Component({
  selector: 'vex-publisher-data-display',
  template: `
    <div *ngIf="api.id" fxFlexLayout="row" fxLayoutGap="8px">
      <a mat-stroked-button color="primary" href="{{activeProfile.portalUrl}}/store/apis/info?name={{api.name}}&version={{api.version}}&provider={{api.provider}}" target="_blank">
        <mat-icon [icIcon]="icGlobe" inline="true" size="24px"></mat-icon>
        STORE
      </a>
      <a mat-stroked-button color="warn" href="{{activeProfile.portalUrl}}/publisher/info?name={{api.name}}&version={{api.version}}&provider={{api.provider}}" target="_blank">
        <mat-icon [icIcon]="icGlobe" inline="true" size="24px"></mat-icon>
        PUBLISHER
      </a>
    </div>
  `,
  styles: []
})
export class AccountPortalComponent extends JsonFormsControl {
  icGlobe = icGlobe;

  api: any;
  options = new JsonEditorOptions();
  activeProfile: Profile;

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  constructor(
    jsonFormsAngularService: JsonFormsAngularService,
    private apiConfigService: ApiConfigService) {
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
}
