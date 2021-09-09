import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import icCreate from '@iconify/icons-ic/outline-build-circle';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { ApiDetail } from 'src/app/types/api.interface';
import { PublisherService } from '../services/publisher.service';
import { PublisherSwaggerImportComponent } from './publisher-swagger-import/publisher-swagger-import.component';

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
    private dialog: MatDialog,
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
      .subscribe((data) => {
        this.dialog.open(PublisherSwaggerImportComponent, {
          data,
          width: '750px',
          disableClose: true
        })
          .afterClosed().subscribe((drafts: ApiDetail[]) => {
            this.publisherService.draftAPIs.next(drafts);
            this.createNew();
          });
      },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  createNew() {
    this.router.navigate(['../', 'edit'], { relativeTo: this.route });
  }

}
