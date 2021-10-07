import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import icCreate from '@iconify/icons-ic/outline-build-circle';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { ApiDetail } from 'src/app/types/api.interface';
import { PublisherService } from '../services/publisher.service';
import { PublisherSwaggerImportComponent } from './publisher-swagger-import/publisher-swagger-import.component';

import { Resolver } from '@stoplight/json-ref-resolver';
const jsonRefResolver = new Resolver();

@Component({
  selector: 'vex-publisher-new',
  templateUrl: './publisher-new.component.html',
  styleUrls: ['./publisher-new.component.scss'],
  animations: [
    stagger40ms,
    fadeInUp400ms,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublisherNewComponent implements OnInit {

  icCreate = icCreate;
  isLoading = false;

  swaggerCtrl = new FormControl();

  options = { mode: 'code', modes: ['code', 'tree'] } as JsonEditorOptions;
  json = null;

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private publisherService: PublisherService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.options.onChange = () => this.cd.markForCheck();
  }

  ngOnInit(): void {
  }

  isSubmitableImport() {
    return this.swaggerCtrl.dirty && this.swaggerCtrl.valid && (this.swaggerCtrl.value as string).startsWith('http');
  }

  isSubmitableImportClipboard() {
    return this.editor && this.editor.isValidJson();
  }

  async importFromClipboard() {
    const resolved = await jsonRefResolver.resolve(this.editor.get());
    const swagger = JSON.parse(JSON.stringify(resolved.result));
    delete (swagger.definitions);
    delete (swagger.components);
    delete (swagger.tags);

    this.dialog.open(PublisherSwaggerImportComponent, {
      data: swagger,
      width: '900px',
      disableClose: true
    })
      .afterClosed().subscribe((drafts: ApiDetail[]) => {
        if (drafts) {
          this.publisherService.draftAPIs.next(drafts);
          this.router.navigate(['../', 'edit'], { relativeTo: this.route });
        }
      });
  }

  async importFromURL() {
    this.isLoading = true;
    this.publisherService.getSwaggerJson(this.swaggerCtrl.value)
      .toPromise()
      .then(data => {
        jsonRefResolver.resolve(data).then(resolved => {
          const swagger = JSON.parse(JSON.stringify(resolved.result));
          delete (swagger.definitions);
          delete (swagger.components);
          delete (swagger.tags);

          this.dialog.open(PublisherSwaggerImportComponent, {
            data: swagger,
            width: '900px',
            disableClose: true
          })
            .afterClosed()
            .subscribe((drafts: ApiDetail[]) => {
              if (drafts) {
                this.publisherService.draftAPIs.next(drafts);
                this.router.navigate(['../', 'edit'], { relativeTo: this.route });
              } else {
                this.isLoading = false;
                this.cd.markForCheck();
              }
            });
        });
      }).catch(() => {
        this.isLoading = false;
        this.cd.markForCheck();
      });
  }

  createNew() {
    this.router.navigate(['../', 'edit'], { relativeTo: this.route });
  }
}
