import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, publishReplay, refCount, switchMap } from 'rxjs/operators';
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

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private apiConfigService: ApiConfigService,
  ) { }

  public applicationTiers() {
    return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL_STORE, 'application'].join('/')) as Observable<Paginate<Tier>>;
  }

  public apiTiers(serverLoad = false) {
    if (this.apiConfigService.subscriptionTiers.value.length === 0 || serverLoad) {
      const scope = 'apim:tier_view';

      const publisher = this.apiConfigService.getActivePublisher();
      if (!publisher) {
        return throwError('Invalid Publisher Profile, please setup its first!');
      }

      const loginRq: LoginRq = { username: publisher.username, password: decode(publisher.password), grant_type: 'password', scope };

      return this.authService.token(loginRq, publisher.clientDigest)
        .pipe(
          switchMap(token => {
            const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
            return this.httpClient.get<Paginate<Tier>>(
              [this.apiConfigService.getApiUrl(),
              this.URL_PUBLISHER, 'api'].join('/'),
              { headers }
            ).pipe(map(data => {
              const list = data.list;
              list.forEach(t => {
                t.selected = ['Default', 'Unlimited'].includes(t.name) || t.name.startsWith('TPS-');
                t.default = ['Default'].includes(t.name);
              });

              this.apiConfigService.updateSubsTiers(list);
              return list;
            }));
          })
        );
    }

    return this.apiConfigService.subscriptionTiers$;
  }
}
