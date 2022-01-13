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
import * as Converter from 'api-spec-converter';

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
    let apiDef = JSON.parse(JSON.stringify(this.editor.get()));

    if (apiDef.swagger) {
      const converted: any = await Converter.convert({ from: 'swagger_2', to: 'openapi_3', source: apiDef });
      const convertedSpec = JSON.parse(JSON.stringify(converted.spec));

      apiDef = {
        ...convertedSpec,
        ...{ servers: [{ url: 'http://' + apiDef.host }] },
        ...{ info: { title: apiDef.host?.split('.')[0] } }
      };
    }

    const resolved = await jsonRefResolver.resolve(apiDef);

    apiDef = {
      ...JSON.parse(JSON.stringify(resolved.result)),
      // ...{ servers: [{ url: 'http://' + apiDef }] },
    };

    delete (apiDef.definitions);
    delete (apiDef.components);
    delete (apiDef.tags);

    this.dialog.open(PublisherSwaggerImportComponent, {
      data: apiDef,
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
      .subscribe(async (data: any) => {
        let apiDef = JSON.parse(JSON.stringify(data));
        const host = (this.swaggerCtrl.value as string).split('/')[2];
        const scheme = (this.swaggerCtrl.value as string).split('/')[0];

        if (apiDef.swagger) {
          const converted: any = await Converter.convert({ from: 'swagger_2', to: 'openapi_3', source: apiDef });
          const convertedSpec = JSON.parse(JSON.stringify(converted.spec));

          apiDef = {
            ...convertedSpec,
            ...{ info: { title: host?.split('.')[0] } }
          };
        }

        const resolved: any = await jsonRefResolver.resolve(apiDef);

        apiDef = {
          ...JSON.parse(JSON.stringify(resolved.result)),
          ...{ servers: [{ url: scheme + '//' + host }] },
        };

        delete (apiDef.definitions);
        delete (apiDef.components);
        delete (apiDef.tags);

        this.dialog.open(PublisherSwaggerImportComponent, {
          data: apiDef,
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
      }, () => {
        this.isLoading = false;
        this.cd.markForCheck();
      });
  }

  createNew() {
    this.router.navigate(['../', 'edit'], { relativeTo: this.route });
  }
}
