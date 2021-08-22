import { Component, OnInit } from '@angular/core';
import { PublisherService } from '../services/publisher.service';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

import jmespath from 'jmespath';

@Component({
  selector: 'vex-publisher-edit',
  templateUrl: './publisher-edit.component.html',
  styleUrls: ['./publisher-edit.component.scss']
})
export class PublisherEditComponent implements OnInit {
  jmespath = jmespath;

  api: any;
  constructor(private publiserService: PublisherService) { }

  ngOnInit(): void {
    // this.publiserService.getSwaggerJson('https://petstore.swagger.io/v2/swagger.json').subscribe(rs => {
    //   this.api = rs;
    // });

    const ui = SwaggerUIBundle({
      dom_id: '#swagger-ui',
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: 'https://petstore.swagger.io/v2/swagger.json',
      operationsSorter: 'alpha'
    });
  }

}
