import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginate } from '../types/paginate.interface';
import { Tier } from '../types/tier.interface';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class TierService {
  private readonly URL = 'store/tiers';

  constructor(
    private httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
  ) { }

  public applicationTiers(offset: number = 0, limit: number = 1000) {
    return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL, 'application'].join('/')) as Observable<Paginate<Tier>>;
  }

  public apiTiers(offset: number = 0, limit: number = 1000) {
    return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL, 'api'].join('/')) as Observable<Paginate<Tier>>;
  }
}
