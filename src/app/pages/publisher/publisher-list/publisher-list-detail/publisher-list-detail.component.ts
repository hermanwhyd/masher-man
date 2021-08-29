import { Component, Input, OnInit } from '@angular/core';

import icArrowBack from '@iconify/icons-ic/twotone-arrow-back';
import icPencil from '@iconify/icons-ic/edit';

import { ApiDetail } from 'src/app/types/api.interface';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { PublisherService } from '../../services/publisher.service';
import { of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'vex-publisher-list-detail',
  templateUrl: './publisher-list-detail.component.html',
  styleUrls: ['./publisher-list-detail.component.scss']
})
export class PublisherListDetailComponent implements OnInit {

  icArrowBack = icArrowBack;
  icPencil = icPencil;
  model: ApiDetail;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      untilDestroyed(this),
      map((params: any) => params.get('apiId')),
      distinctUntilChanged(),
      filter<string>(Boolean),
      switchMap(apiId => this.publisherService.getApiDetail(apiId).pipe(finalize(() => this.isLoading = false)))
    ).subscribe((data) => {
      this.model = data;
    });
  }

}
