import { Component, ViewChild } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { and, ControlProps, isControl, RankedTester, rankWith, scopeEndsWith } from '@jsonforms/core';

import icKey from '@iconify/icons-ic/baseline-vpn-key';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Profile } from 'src/app/types/api-config.interface';
import { Key } from 'src/app/types/application.interface';

@Component({
  selector: 'vex-keymapper-portal',
  template: `
  <form action="{{activeProfile.portalUrl}}/keymapper/faces/pages/addnewmapping.xhtml" method="post" target="_blank" *ngIf="this.key.token.validityTime < 0">
    <input type="hidden" name="consumerkey" value="{{key.consumerKey}}">
    <input type="hidden" name="secretKey" value="{{key.consumerSecret}}">
    <button type="submit" mat-raised-button color="primary" class="h-14">
      <mat-icon [icIcon]="icKey" inline="true" size="20px" class="mr-2"></mat-icon>
      <span class="truncate">CLIENT ID AUTHENTICATION MAPPING</span>
    </button>
  </form>
  `,
  styles: []
})
export class KeyMapperComponent extends JsonFormsControl {
  icKey = icKey;

  key: Key;
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
    this.key = props.data;
  }

}

export const keyMapperPortalTester: RankedTester = rankWith(6, and(isControl, scopeEndsWith('___keymapper')));
