import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Paginate } from 'src/app/types/paginate.interface';
import { decode } from 'src/app/utilities/function/base64-util';
import { AuthService } from '../pages/access/auth-manager/services/auth.service';
import { LoginRq } from '../pages/access/auth-manager/services/oauth.interface';
import { Application, Consumer, GenerateKey, Key } from '../types/application.interface';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private readonly URL = 'store/applications';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private apiConfigService: ApiConfigService) { }

  public reGenerateKey(consumerKey: string) {
    const scope = 'apim:subscribe';

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.post([this.apiConfigService.getApiUrl(), this.URL, 'regenerate-consumersecret'].join('/'),
          { consumerKey }, { headers }) as Observable<Consumer>;
      })) as Observable<Consumer>;
  }

  public generateKey(appid: string, generateKey: GenerateKey) {
    const scope = 'apim:subscribe';

    const params = new HttpParams().append('applicationId', appid);

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.post([this.apiConfigService.getApiUrl(), this.URL, 'generate-keys'].join('/'),
          generateKey, { params, headers }) as Observable<Key>;
      })) as Observable<Key>;
  }

  public getApplications(offset: number = 0, limit: number = 1000, query?: string) {
    const scope = 'apim:subscribe';

    let params = new HttpParams().append('offset', offset).append('limit', limit);
    if (query) {
      params = params.append('query', query);
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
          , { params, headers }) as Observable<Paginate<Application>>;
      })) as Observable<Paginate<Application>>;
  }

  public getApplicationDetail(appId: Application['applicationId']) {
    const scope = 'apim:subscribe';

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL, appId].join('/')
          , { headers }) as Observable<Application>;
      })) as Observable<Application>;
  }

  createOrUpdateApplication(application: Application) {

    const scope = 'apim:subscribe';

    const store = this.apiConfigService.getActiveStore();
    if (!store) {
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        if (!!application.applicationId) {
          return this.httpClient.put([this.apiConfigService.getApiUrl(), this.URL, application.applicationId].join('/'),
            application, { headers }) as Observable<Application>;
        } else {
          return this.httpClient.post([this.apiConfigService.getApiUrl(), this.URL].join('/'),
            application, { headers }) as Observable<Application>;
        }
      })) as Observable<Application>;

  }
}
