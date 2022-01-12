import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { LayoutService } from '../../../@vex/services/layout.service';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { fadeInRight400ms } from '../../../@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { stagger80ms } from '../../../@vex/animations/stagger.animation';
import { SidebarMenu } from './interfaces/sidebar-menu.interface';
import { SetupApiComponent } from './components/setup-api/setup-api.component';
import { SetupUserComponent } from './components/setup-user/setup-user.component';
import { SetupTierComponent } from './components/setup-tier/setup-tier.component';

@Component({
  selector: 'vex-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  animations: [
    stagger80ms,
    fadeInRight400ms,
    fadeInUp400ms
  ]
})
export class SetupComponent implements OnInit {
  menuWidth = '250px';

  sidebarMenu: SidebarMenu[] = [
    { type: 'subheader', title: 'BASE CONFIG', element: '', active: false },
    { type: 'link', element: 'setupApi', title: 'API Config', active: true },
    { type: 'subheader', title: 'ACCOUNT CONFIG', element: '', active: false },
    { type: 'link', element: 'setupUser', title: 'Publisher', active: false },
    { type: 'link', element: 'setupUser', title: 'Store', active: false },
    { type: 'link', element: 'setupTier', title: 'Subscription Tiers', active: false },
  ];

  @ViewChild(SetupUserComponent, { read: ElementRef, static: true }) private setupUser: ElementRef;
  @ViewChild(SetupTierComponent, { read: ElementRef, static: true }) private setupTier: ElementRef;
  @ViewChild(SetupApiComponent, { read: ElementRef, static: true }) private setupApi: ElementRef;
  constructor(
    private layoutService: LayoutService,
    private scrollDispatcher: ScrollDispatcher,
    private elem: ElementRef) { }

  ngOnInit(): void { }

  scrollTo(element: SidebarMenu) {
    this.scrollDispatcher.getAncestorScrollContainers(this.elem)[0].scrollTo({
      top: this[element.element].nativeElement.offsetTop - 24,
      behavior: 'smooth'
    });

    // -- Set active
    this.sidebarMenu.forEach(sm => sm.active = false);
    element.active = true;
  }
}
