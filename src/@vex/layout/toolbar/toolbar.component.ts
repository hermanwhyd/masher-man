import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icRefresh from '@iconify/icons-ic/baseline-refresh';
import { ThemeConfigService } from '../../services/theme-config.service';
import { map } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { Router } from '@angular/router';

import icApiGW from '@iconify/icons-logos/aws-api-gateway';

import { ApiConfigService } from 'src/app/services/api-config.service';

@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  icApiGW = icApiGW;

  activeProfileName: string;

  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow: boolean;

  navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
  isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
  isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
  isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));

  icMenu = icMenu;
  icArrowDropDown = icArrowDropDown;
  icRefresh = icRefresh;

  accounts$ = this.apiConfigService.accounts$;

  constructor(
    private layoutService: LayoutService,
    private configService: ThemeConfigService,
    private navigationService: NavigationService,
    private router: Router,
    private apiConfigService: ApiConfigService) { }

  ngOnInit() {
    this.apiConfigService.profiles$.subscribe(() => {
      this.activeProfileName = this.apiConfigService.getActiveProfile()?.name;
    });
  }

  openQuickpanel() {
    this.layoutService.openQuickpanel();
  }

  openSidenav() {
    this.layoutService.openSidenav();
  }

  reloadPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  openPanelProfile() {
    this.layoutService.openProfilepanel();
  }
}
