import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Paginate } from 'src/app/types/paginate.interface';
import { Subscription } from 'src/app/types/subscription.interface';
import { decode } from 'src/app/utilities/function/base64-util';
import { AuthService } from '../pages/access/auth-manager/services/auth.service';
import { LoginRq } from '../pages/access/auth-manager/services/oauth.interface';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private readonly URL = 'store/subscriptions';
  private readonly URL_PUBLISHER = 'publisher/subscriptions';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private apiConfigService: ApiConfigService) { }

  public subscribe(subscriptions: Subscription[]) {
    const scope = 'apim:subscribe';

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.post([this.apiConfigService.getApiUrl(), this.URL, 'multiple'].join('/'),
          subscriptions, { headers }) as Observable<Subscription[]>;
      })) as Observable<Subscription[]>;
  }

  public getAppSubscription(applicationId: string, offset: number = 0, limit: number = 1000) {
    const scope = 'apim:subscribe';

    let params = new HttpParams().append('offset', offset).append('limit', limit);
    if (applicationId) {
      params = params.append('applicationId', applicationId);
    }

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL].join('/')
          , { params, headers }) as Observable<Paginate<Subscription>>;
      })) as Observable<Paginate<Subscription>>;
  }

  public getApiSubscriber(apiId: string, offset: number = 0, limit: number = 1000) {
    const scope = 'apim:subscribe';

    let params = new HttpParams().append('offset', offset).append('limit', limit);
    if (apiId) {
      params = params.append('apiId', apiId);
    }

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL].join('/')
          , { params, headers }) as Observable<Paginate<Subscription>>;
      })) as Observable<Paginate<Subscription>>;
  }

  public approve(subscriptionId: string) {
    const scope = 'apim:subscription_block';

    const params = new HttpParams().append('subscriptionId', subscriptionId);

    const account = this.apiConfigService.getActivePublisher();
    if (!account) {
      return throwError('Invalid Publisher Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: account.username, password: decode(account.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, account.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.post([this.apiConfigService.getApiUrl(), this.URL_PUBLISHER, 'unblock-subscription'].join('/'),
          {}, { params, headers }) as Observable<Subscription>;
      })) as Observable<Subscription>;
  }

  public getApiPublisherSubscriber(apiId: string, offset: number = 0, limit: number = 1000) {
    const scope = 'apim:subscription_view';

    let params = new HttpParams().append('offset', offset).append('limit', limit);
    if (apiId) {
      params = params.append('apiId', apiId);
    }

    const account = this.apiConfigService.getActivePublisher();
    if (!account) {
      return throwError('Invalid Publisher Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: account.username, password: decode(account.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, account.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL_PUBLISHER].join('/'),
          { params, headers }) as Observable<Paginate<Subscription>>;
      })) as Observable<Paginate<Subscription>>;
  }

  public unsubscribe(subscriptionId: string) {
    const scope = 'apim:subscribe';

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.delete([this.apiConfigService.getApiUrl(), this.URL, subscriptionId].join('/'),
          { headers }) as Observable<any>;
      })) as Observable<any>;
  }
}
