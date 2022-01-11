import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Api, ApiDetail } from 'src/app/types/api.interface';
import { Application } from 'src/app/types/application.interface';
import { Paginate } from 'src/app/types/paginate.interface';
import { decode } from 'src/app/utilities/function/base64-util';
import { AuthService } from '../../access/auth-manager/services/auth.service';
import { LoginRq } from '../../access/auth-manager/services/oauth.interface';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  private readonly URL = 'publisher/apis';
  private readonly URL_PROXY = 'proxy';
  private readonly URL_APPLICATION = 'publisher/applications';

  public draftAPIs = new BehaviorSubject<ApiDetail[]>([]);
  public draftAPIs$ = this.draftAPIs.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private apiConfigService: ApiConfigService) { }

  public getSwaggerJson(url: string) {
    const headers = new HttpHeaders({ 'target-url': url });
    return this.httpClient
      .get([this.apiConfigService.getApiUrl(), this.URL_PROXY].join('/'), { headers }) as Observable<any>;
  }

  public paginate(offset: number, limit: number, query?: string) {
    const scope = 'apim:api_view';

    let params = new HttpParams().append('offset', offset).append('limit', limit);
    if (query) {
      params = params.append('query', query);
    }

    const publisher = this.apiConfigService.getActivePublisher();
    if (!publisher) {
      return throwError('Invalid Publisher Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: publisher.username, password: decode(publisher.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, publisher.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-www-form-urlencoded' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL].join('/')
          , { params, headers }) as Observable<Paginate<Api>>;
      })) as Observable<Paginate<Api>>;
  }

  public getApiDetail(apiId: Api['id']) {
    const scope = 'apim:api_view';

    const publisher = this.apiConfigService.getActivePublisher();
    if (!publisher) {
      return throwError('Invalid Publisher Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: publisher.username, password: decode(publisher.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, publisher.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL, apiId].join('/')
          , { headers }) as Observable<ApiDetail>;
      })) as Observable<ApiDetail>;
  }

  public createOrUpdateApi(api: ApiDetail) {
    const scope = 'apim:api_create';

    const publisher = this.apiConfigService.getActivePublisher();
    if (!publisher) {
      return throwError('Invalid Publisher Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: publisher.username, password: decode(publisher.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, publisher.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        if (api.id) {
          return this.httpClient.put<ApiDetail>([this.apiConfigService.getApiUrl(), this.URL, api.id].join('/'), { ...api, provider: publisher.username }, { headers });
        } else {
          return this.httpClient.post<ApiDetail>([this.apiConfigService.getApiUrl(), this.URL].join('/'), { ...api, provider: publisher.username }, { headers });
        }
      }));
  }

  getApplicationDetail(appId: string) {
    const scope = 'apim:api_create';

    const account = this.apiConfigService.getActivePublisher();
    if (!account) {
      return throwError('Invalid Publisher Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: account.username, password: decode(account.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, account.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL_APPLICATION, appId].join('/')
          , { headers }) as Observable<Application>;
      })) as Observable<Application>;
  }

  public changeLifeCycle(apiId: string, action: string) {
    const scope = 'apim:api_publish';
    const params = new HttpParams().append('apiId', apiId).append('action', action);

    const publisher = this.apiConfigService.getActivePublisher();
    if (!publisher) {
      return throwError('Invalid Publisher Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: publisher.username, password: decode(publisher.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, publisher.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.post(
          [this.apiConfigService.getApiUrl(), this.URL, 'change-lifecycle'].join('/')
          , null
          , { params, headers }) as Observable<any>;
      })) as Observable<any>;
  }
}
