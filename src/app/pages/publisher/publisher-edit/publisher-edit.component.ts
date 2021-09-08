import { Component, OnInit } from '@angular/core';
import { PublisherService } from '../services/publisher.service';

import jmespath from 'jmespath';
import { ApiDetail } from 'src/app/types/api.interface';

import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { and, isControl, rankWith, scopeEndsWith } from '@jsonforms/core';
import { PublisherDataDisplayComponent } from './publisher-data-display.component';

import uischemaAsset from 'src/assets/static-data/publisher/uischema-list.json';
import schemaAsset from 'src/assets/static-data/publisher/schema-list.json';

@Component({
  selector: 'vex-publisher-edit',
  templateUrl: './publisher-edit.component.html',
  styleUrls: ['./publisher-edit.component.scss']
})
export class PublisherEditComponent implements OnInit {
  jmespath = jmespath;

  draftAPIs = [] as ApiDetail[];
  model = { apis: this.draftAPIs };

  uischema = uischemaAsset;
  schema = schemaAsset;

  renderers = [
    ...angularMaterialRenderers,
    {
      renderer: PublisherDataDisplayComponent,
      tester: rankWith(6, and(isControl, scopeEndsWith('___data')))
    }
  ];

  constructor(private publiserService: PublisherService) { }

  ngOnInit(): void {
    this.publiserService.draftAPIs$.subscribe(data => {
      this.draftAPIs = data;
      this.model.apis = data;
    });
  }

  onChange(event: any) {
    console.log(event);
  }

  add() {
    this.model.apis.push({} as ApiDetail);

    console.log(this.model);
  }
}
