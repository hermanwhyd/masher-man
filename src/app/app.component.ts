import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ConfigService } from '../@vex/services/config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@vex/services/navigation.service';

import icLayers from '@iconify/icons-ic/twotone-layers';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icAccountCircle from '@iconify/icons-ic/baseline-people-outline';
import icTraining from '@iconify/icons-ic/baseline-model-training';
import icVoucher from '@iconify/icons-ic/twotone-card-giftcard';
import icUser from '@iconify/icons-ic/baseline-supervised-user-circle';
import icStyle from '@iconify/icons-ic/style';
import icTag from '@iconify/icons-ic/baseline-tag';
import icAds from '@iconify/icons-ic/baseline-music-video';
import icProduct from '@iconify/icons-ic/outline-shopping-cart';

import { LayoutService } from '../@vex/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { SplashScreenService } from '../@vex/services/splash-screen.service';
import { StyleService } from '../@vex/services/style.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MasherMan';

  constructor(
    private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private splashScreenService: SplashScreenService,
    private authSvc: AuthService
  ) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    this.navigationService.items = [
      {
        type: 'dropdown',
        label: 'Dashboard',
        icon: icLayers,
        children: [
          {
            type: 'link',
            label: 'Navigasi',
            route: '/dashboard'
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Workspace',
        children: [
          {
            type: 'dropdown',
            label: 'Publisher',
            icon: icTraining,
            children: [
              {
                type: 'link',
                label: 'Listed API',
                route: '/publisher/list'
              },
              {
                type: 'link',
                label: 'New API',
                route: '/publisher/new'
              },
              {
                type: 'link',
                label: 'Import Swagger',
                route: '/publisher/import-swagger'
              }
            ]
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Social',
        children: [
          {
            type: 'link',
            label: 'Status',
            icon: icTraining,
            route: '/status'
          },
          {
            type: 'link',
            label: 'Pengguna',
            icon: icUser,
            route: '/pengguna'
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Customize',
        children: [
          {
            type: 'link',
            label: 'Personalize',
            route: () => this.layoutService.openConfigpanel(),
            icon: icStyle
          }
        ]
      }
    ];
  }
}
