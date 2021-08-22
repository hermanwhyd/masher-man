import { Component, OnInit } from '@angular/core';
import icSearch from '@iconify/icons-ic/twotone-search';

@Component({
  selector: 'vex-error403',
  templateUrl: './error-403.component.html',
  styleUrls: ['./error-403.component.scss']
})
export class Error403Component implements OnInit {

  icSearch = icSearch;

  constructor() { }

  ngOnInit() {
  }

}
