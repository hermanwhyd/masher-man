import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PopoverService } from '../../../components/popover/popover.service';
import icPerson from '@iconify/icons-ic/twotone-person';
import { AuthService } from 'src/app/pages/access/auth-manager/services/auth.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { upperCase } from 'lodash';

@Component({
  selector: 'vex-toolbar-user',
  templateUrl: './toolbar-user.component.html'
})
export class ToolbarUserComponent implements OnInit {

  dropdownOpen: boolean;
  icPerson = icPerson;

  fullname = 'GUEST';

  @Output() openPanelProfile = new EventEmitter();

  constructor(
    private apiConfigService: ApiConfigService,
    private popover: PopoverService,
    private authService: AuthService) { }

  ngOnInit() {
    this.apiConfigService.accounts$.subscribe(() => {
      this.fullname = upperCase(this.apiConfigService.getActiveStore()?.username || 'GUEST');
    });
  }
}
