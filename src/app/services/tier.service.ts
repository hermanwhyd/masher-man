import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';
import { AuthService } from '../pages/access/auth-manager/services/auth.service';
import { LoginRq } from '../pages/access/auth-manager/services/oauth.interface';
import { Paginate } from '../types/paginate.interface';
import { Tier } from '../types/tier.interface';
import { decode } from '../utilities/function/base64-util';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class TierService {
  private readonly URL_STORE = 'store/tiers';
  private readonly URL_PUBLISHER = 'publisher/tiers';

  private apiTierCache: Observable<Paginate<Tier>>;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private apiConfigService: ApiConfigService,
  ) { }

  public applicationTiers(offset: number = 0, limit: number = 1000) {
    return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL_STORE, 'application'].join('/')) as Observable<Paginate<Tier>>;
  }

  public apiTiers(offset: number = 0, limit: number = 1000) {
    // Cache it once if apiTier value is false
    if (!this.apiTierCache) {
      const scope = 'apim:tier_view';

      const publisher = this.apiConfigService.getActivePublisher();
      if (!publisher) {
        return throwError('Invalid Publisher Profile, please setup its first!');
      }

      const loginRq: LoginRq = { username: publisher.username, password: decode(publisher.password), grant_type: 'password', scope };

      this.apiTierCache = this.authService.token(loginRq, publisher.clientDigest)
        .pipe(switchMap(token => {
          const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
          return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL_PUBLISHER, 'api'].join('/'), { headers });
        }),
          publishReplay(1), // this tells Rx to cache the latest emitted
          refCount() // and this tells Rx to keep the Observable alive as long as there are any Subscribers
        );
    }

    return this.apiTierCache;
  }
}
