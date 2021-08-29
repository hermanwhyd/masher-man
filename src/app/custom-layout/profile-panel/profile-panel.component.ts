import { Component, OnInit } from '@angular/core';
import icSettings from '@iconify/icons-ic/twotone-settings';
import { MatRadioChange } from '@angular/material/radio';
import icClose from '@iconify/icons-ic/twotone-close';
import { LayoutService } from 'src/@vex/services/layout.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Account } from 'src/app/types/api-config.interface';

@Component({
  selector: 'vex-profile-panel',
  templateUrl: './profile-panel.component.html',
  styleUrls: ['./profile-panel.component.scss']
})
export class ProfilepanelComponent implements OnInit {

  icSettings = icSettings;
  icClose = icClose;

  profiles$ = this.apiConfigService.profiles$;
  account: Account;

  constructor(
    private layoutService: LayoutService,
    private apiConfigService: ApiConfigService) { }

  ngOnInit() {
    this.apiConfigService.accounts$.subscribe((accounts) => this.account = accounts.find(a => a.active === true));
  }

  closeProfilepanel() {
    this.layoutService.closeProfilepanel();
  }

  profileChange(change: MatRadioChange) {
    this.apiConfigService.setActiveProfile(change.value);
  }

  publisherChange(change: MatRadioChange) {
    this.apiConfigService.setActiveAccountPublisher(change.value);
  }

  storeChange(change: MatRadioChange) {
    this.apiConfigService.setActiveAccountStore(change.value);
  }

  apiManagerChange(change: MatRadioChange) {
    this.apiConfigService.setActiveAccountApiManager(change.value);
  }
}
