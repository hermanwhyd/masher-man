import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Icon } from '@visurel/iconify-angular';
import icHelp from '@iconify/icons-ic/help-outline';
import { scaleInOutAnimation } from 'src/@vex/animations/scale-in-out.animation';

@Component({
  selector: 'vex-widget-quick-value-center',
  templateUrl: './widget-quick-value-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleInOutAnimation]
})
export class WidgetQuickValueCenterComponent implements OnInit {

  @Input() isLoading = false;
  @Input() icon: Icon;
  @Input() value: string;
  @Input() label: string;
  @Input() helpText: string;
  @Input() iconClass: string;

  icHelp = icHelp;

  constructor() { }

  ngOnInit() {
  }
}
