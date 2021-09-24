import { Component, OnInit } from '@angular/core';

import { Link } from '../../../@vex/interfaces/link.interface';
import { trackByRoute } from '../../../@vex/utils/track-by';
import { Icon } from '@visurel/iconify-angular';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { stagger40ms } from '../../../@vex/animations/stagger.animation';

import icFolder from '@iconify/icons-ic/baseline-snippet-folder';
import icTraining from '@iconify/icons-ic/baseline-model-training';
import icStore from '@iconify/icons-ic/outline-shopping-cart';
import icNew from '@iconify/icons-ic/baseline-fiber-new';

import * as _ from 'lodash';
import { AuthService } from 'src/app/pages/access/auth-manager/services/auth.service';
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

  links: (Link & { icon: Icon })[] = [
    {
      label: 'Publisher - API List',
      route: '/publisher',
      icon: icTraining
    },
    {
      label: 'New API',
      route: '/publisher/add',
      icon: icNew
    },
    {
      label: 'Store - API List',
      route: '/store',
      icon: icStore
    },
    {
      label: 'Application',
      route: '/store/application',
      icon: icFolder
    }
  ];

  trackByRoute = trackByRoute;

  constructor(private authService: AuthService) { }

  sharedProps: SharedProperty[] = [];

  ngOnInit(): void {
  }

  sharedPropText(code: string): string {
    const sp = this.sharedProps.find(s => s.code === code);
    return !!sp ? sp.label : '';
  }

  get enabledLink() {
    return this.links;
  }

}
