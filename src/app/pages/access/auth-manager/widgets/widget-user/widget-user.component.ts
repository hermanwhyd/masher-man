import { Component, OnInit } from '@angular/core';

import icCheck from '@iconify/icons-ic/outline-check-box';
import icUnCheck from '@iconify/icons-ic/outline-disabled-by-default';
import icRemove from '@iconify/icons-ic/twotone-delete';
import icon from '@iconify/icons-ic/twotone-delete';

@Component({
  selector: 'vex-widget-user',
  templateUrl: './widget-user.component.html',
  styleUrls: ['./widget-user.component.scss']
})
export class WidgetUserComponent implements OnInit {

  icCheck = icCheck;
  icUnCheck = icUnCheck;
  icRemove = icRemove;
  icon = icon;

  constructor() { }

  ngOnInit(): void {
  }

}
