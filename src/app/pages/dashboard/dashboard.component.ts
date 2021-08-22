import { Component, OnInit } from '@angular/core';

import { Link } from '../../../@vex/interfaces/link.interface';
import { trackByRoute } from '../../../@vex/utils/track-by';
import { Icon } from '@visurel/iconify-angular';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { stagger40ms } from '../../../@vex/animations/stagger.animation';

import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';

import icPayment from '@iconify/icons-ic/baseline-payment';

import icLandScap from '@iconify/icons-ic/round-landscape';
import icNote2 from '@iconify/icons-ic/round-sticky-note-2';

import * as _ from 'lodash';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedPropertyService } from '../../services/shared-property.service';
import { SharedProperty } from 'src/app/types/shared-property.interface';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})
export class DashboardComponent implements OnInit {
  icPhoneInTalk = icPhoneInTalk;
  icMail = icMail;

  links: (Link & { icon: Icon })[] = [
    {
      label: 'Dashboard 1',
      route: '/dashboard/1',
      icon: icPayment
    },
    {
      label: 'Dashboard 2',
      route: '/dashboard/2',
      icon: icLandScap
    },
    {
      label: 'Dashboard 3',
      route: '/dashboard/3',
      icon: icNote2
    }
  ];

  trackByRoute = trackByRoute;

  constructor(private authService: AuthService, private sharedPropService: SharedPropertyService) { }

  sharedProps: SharedProperty[] = [];

  ngOnInit(): void {
    this.sharedProps = this.sharedPropService.getSharedPropCache();
  }

  sharedPropText(code: string): string {
    const sp = this.sharedProps.find(s => s.code === code);
    return !!sp ? sp.label : '';
  }

  get enabledLink() {
    return this.links;
  }

}
