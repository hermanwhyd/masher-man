import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { TierService } from 'src/app/services/tier.service';
import { Tier } from 'src/app/types/tier.interface';

@Component({
  selector: 'vex-setup-tier',
  templateUrl: './setup-tier.component.html',
  styleUrls: ['./setup-tier.component.scss']
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
    this.apiConfigService.accounts$.subscribe(() => {
      this.radio.select(this.defaultTierName);
      this.selection.select(...this.selectedTierName);
      this.tiers = this.currentTiers;
    });
  }

  refresh() {
    this.isLoading = true;
    this.tierService.apiTiers(true)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        this.apiConfigService.updateSubsTiers(data);
        this.tiers = this.currentTiers;
      });
  }

  onTierChange(tierName: string) {
    this.selection.toggle(tierName);
    this.apiConfigService.updateSelectedSubsTier(this.selection.selected);
  }

  onDefaultChange(tierName: string) {
    this.radio.toggle(tierName);
    this.apiConfigService.updateDefaultSubsTier(tierName);
  }

  get defaultTierName() {
    return this.apiConfigService.getDefaultSubsTier()?.name || null;
  }

  get selectedTierName() {
    return this.apiConfigService.getSelectedSubsTier().map(t => t.name) || [];
  }

  get currentTiers() {
    return this.apiConfigService.getActiveAccount()?.tiers || [];
  }
}
