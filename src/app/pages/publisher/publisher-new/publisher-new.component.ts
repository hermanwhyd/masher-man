import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import icCreate from '@iconify/icons-ic/outline-build-circle';
import { finalize } from 'rxjs/operators';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { PublisherService } from '../services/publisher.service';

@Component({
  selector: 'vex-publisher-new',
  templateUrl: './publisher-new.component.html',
  styleUrls: ['./publisher-new.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms,
  ]
})
export class PublisherNewComponent implements OnInit {

  icCreate = icCreate;

  isLoading = false;

  swaggerCtrl = new FormControl();

  constructor(
    private publisherService: PublisherService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  isSubmitableImport() {
    return this.swaggerCtrl.dirty && this.swaggerCtrl.valid && (this.swaggerCtrl.value as string).startsWith('http');
  }

  importFromSwagger() {
    this.isLoading = true;
    this.publisherService.getSwaggerJson(this.swaggerCtrl.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data) => {
      });
  }

  createNew() {
    this.publisherService.swagger.next(null);
    this.router.navigate(['../', 'edit'], { relativeTo: this.route });
  }

}
