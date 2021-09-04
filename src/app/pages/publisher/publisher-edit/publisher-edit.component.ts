import { Component, OnInit } from '@angular/core';
import { PublisherService } from '../services/publisher.service';

import jmespath from 'jmespath';

@Component({
  selector: 'vex-publisher-edit',
  templateUrl: './publisher-edit.component.html',
  styleUrls: ['./publisher-edit.component.scss']
})
export class PublisherEditComponent implements OnInit {
  jmespath = jmespath;

  swagger$ = this.publiserService.swagger$;
  swagger: string;

  constructor(private publiserService: PublisherService) { }

  ngOnInit(): void {
    this.swagger$.subscribe(data => this.swagger = data);
  }

}
