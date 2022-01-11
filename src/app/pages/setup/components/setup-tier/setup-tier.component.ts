import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { finalize, first } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { TierService } from 'src/app/services/tier.service';

@Component({
  selector: 'vex-setup-tier',
  templateUrl: './setup-tier.component.html',
  styleUrls: ['./setup-tier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetupTierComponent implements OnInit {

  isLoading = false;
  selection = new SelectionModel<string>(true, []);
  radio = new SelectionModel<string>(false, []);

  subscriptionTiers$ = this.apiConfigService.subscriptionTiers$;

  constructor(
    private apiConfigService: ApiConfigService,
    private tierService: TierService,
  ) { }

  ngOnInit(): void {
    this.selection.changed
      .subscribe(() => {
        if (!this.selection.isSelected('Default')) {
          this.selection.select('Default');
        }

        this.apiConfigService.updateSelectedSubsTier(this.selection.selected);
      });

    this.radio.changed
      .subscribe(() => {
        this.apiConfigService.updateDefaultSubsTier(this.radio.selected[0]);
      });

    this.subscriptionTiers$
      .pipe(first())
      .subscribe(data => {
        // this.selection.clear();
        this.radio.select(this.apiConfigService.getDefaultSubsTier());
        this.selection.select(...data.filter(t => t.selected).map(t => t.name));
      });
  }

  refresh() {
    this.isLoading = true;
    this.tierService.apiTiers(true)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        this.apiConfigService.updateSubsTiers(data);
      });
  }
}
