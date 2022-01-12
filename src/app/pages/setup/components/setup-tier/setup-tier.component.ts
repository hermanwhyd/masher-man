import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { TierService } from 'src/app/services/tier.service';
import { Tier } from 'src/app/types/tier.interface';

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

  tiers: Tier[] = [];

  constructor(
    private apiConfigService: ApiConfigService,
    private tierService: TierService,
  ) { }

  ngOnInit(): void {
    this.selection.changed
      .subscribe(() => {
        // if (_.difference(this.selection.selected, this.apiConfigService.getSelectedSubsTier()) ||
        //   _.difference(this.apiConfigService.getSelectedSubsTier(), this.selection.selected)) {

        // }

        // this.apiConfigService.updateSelectedSubsTier(this.selection.selected);
      });

    this.radio.changed
      .subscribe(() => {
        if (this.apiConfigService.getDefaultSubsTier() !== this.radio.selected[0]) {
          this.apiConfigService.updateDefaultSubsTier(this.radio.selected[0]);
        }
      });

    this.radio.select(this.apiConfigService.getDefaultSubsTier());
    this.selection.select(...this.apiConfigService.getSelectedSubsTier());
    this.tiers = this.apiConfigService.getActiveAccount()?.tiers || [];
  }

  refresh() {
    this.isLoading = true;
    this.tierService.apiTiers(true)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        this.apiConfigService.updateSubsTiers(data);
        this.tiers = this.apiConfigService.getActiveAccount()?.tiers || [];
      });
  }

  onTierChange(tierName: string) {
    this.selection.toggle(tierName);
    console.log('hallo');
  }
}
