import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger60ms } from 'src/@vex/animations/stagger.animation';
import { Link } from 'src/@vex/interfaces/link.interface';

import icPersonAdd from '@iconify/icons-ic/twotone-person-add';

@Component({
  selector: 'vex-auth-manager',
  templateUrl: './auth-manager.component.html',
  styleUrls: ['./auth-manager.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class AuthManagerComponent implements OnInit {

  icPersonAdd = icPersonAdd;

  activeCategory: string;

  constructor(private route: ActivatedRoute) { }

  links: Link[] = [
    {
      label: 'PUBLISHER',
      route: '../publisher'
    },
    {
      label: 'STORE',
      route: '../store'
    },
    {
      label: 'API MANAGER',
      route: '../api-manager'
    }
  ];

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(paramMap => paramMap.get('activeCategory'))
    ).subscribe(a => this.activeCategory = a);
  }

}
