import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ThemeConfigService } from '../@vex/services/theme-config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@vex/services/navigation.service';

import icLayers from '@iconify/icons-ic/twotone-layers';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icTraining from '@iconify/icons-ic/baseline-model-training';
import icStyle from '@iconify/icons-ic/style';
import icStore from '@iconify/icons-ic/outline-shopping-cart';
import icFolder from '@iconify/icons-ic/baseline-snippet-folder';

import { LayoutService } from '../@vex/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { SplashScreenService } from '../@vex/services/splash-screen.service';
import { StyleService } from '../@vex/services/style.service';
import { AuthService } from './pages/access/auth-manager/services/auth.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MasherMan';

  constructor(
    private configService: ThemeConfigService,
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
        type: 'link',
        label: 'Dashboard',
        icon: icLayers,
        route: '/dashboard'
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
                route: '/publisher/add'
              }
            ]
          },
          {
            type: 'link',
            label: 'Store',
            icon: icStore,
            route: '/store/list'
          },
          {
            type: 'link',
            label: 'Application',
            icon: icFolder,
            route: '/store/application'
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Settings',
        children: [
          {
            type: 'link',
            label: 'Setups',
            route: '/setup',
            icon: icSettings,
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
