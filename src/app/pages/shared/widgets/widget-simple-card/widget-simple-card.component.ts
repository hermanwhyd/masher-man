import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import icHelp from '@iconify/icons-ic/help-outline';
import { scaleInOutAnimation } from 'src/@vex/animations/scale-in-out.animation';

@Component({
  selector: 'vex-widget-simple-card',
  templateUrl: './widget-simple-card.component.html',
  styleUrls: ['./widget-simple-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleInOutAnimation]
})
export class WidgetSimpleCardComponent implements OnInit {

  @Input() statement: string;
  @Input() value: string;
  @Input() label: string;
  @Input() helpText: string;

  icHelp = icHelp;

  showHelper: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
