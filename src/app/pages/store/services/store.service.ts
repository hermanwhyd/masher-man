import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Api, ApiDetail } from 'src/app/types/api.interface';
import { Application, Subscription } from 'src/app/types/application';
import { Paginate } from 'src/app/types/paginate.interface';
import { decode } from 'src/app/utilities/function/base64-util';
import { AuthService } from '../../access/auth-manager/services/auth.service';
import { LoginRq } from '../../access/auth-manager/services/oauth.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private readonly URL = 'store/apis';
  private readonly URL_APPLICATION = 'store/applications';
  private readonly URL_SUBSCRIPTION = 'store/subscriptions/multiple';

  public draftAPIs = new BehaviorSubject<ApiDetail[]>([]);
  public draftAPIs$ = this.draftAPIs.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private apiConfigService: ApiConfigService) { }

  public paginate(offset: number, limit: number, query?: string) {
    const scope = 'apim:subscribe';

    let params = new HttpParams().append('offset', offset).append('limit', limit);
    if (query) {
      params = params.append('query', query);
    }

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Profile');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-www-form-urlencoded' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL].join('/')
          , { params, headers }) as Observable<Paginate<Api>>;
      })) as Observable<Paginate<Api>>;
  }

  public getApiDetail(apiId: Api['id']) {
    const scope = 'apim:subscribe';

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Profile');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL, apiId].join('/')
          , { headers }) as Observable<ApiDetail>;
      })) as Observable<ApiDetail>;
  }

  public getApplications(offset: number, limit: number, query?: string) {
    const scope = 'apim:subscribe';

    let params = new HttpParams().append('offset', offset).append('limit', limit);
    if (query) {
      params = params.append('query', query);
    }

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL_APPLICATION].join('/')
          , { params, headers }) as Observable<Paginate<Application>>;
      })) as Observable<Paginate<Application>>;
  }

  public subscribeApi(subscriptions: Subscription[]) {
    const scope = 'apim:subscribe';

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.post([this.apiConfigService.getApiUrl(), this.URL_SUBSCRIPTION].join('/'),
          subscriptions, { headers }) as Observable<Subscription[]>;
      })) as Observable<Subscription[]>;
  }

}
