import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Api, ApiDetail } from 'src/app/types/api.interface';
import { Paginate } from 'src/app/types/paginate.interface';
import { decode } from 'src/app/utilities/function/base64-util';
import { AuthService } from '../../access/auth-manager/services/auth.service';
import { LoginRq } from '../../access/auth-manager/services/oauth.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private readonly URL = 'store/apis';

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
      return throwError('Invalid Store Profile, please setup its first!');
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
      return throwError('Invalid Store Profile, please setup its first!');
    }

    const loginRq: LoginRq = { username: store.username, password: decode(store.password), grant_type: 'password', scope };

    return this.authService.token(loginRq, store.clientDigest)
      .pipe(switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
        return this.httpClient.get([this.apiConfigService.getApiUrl(), this.URL, apiId].join('/')
          , { headers }) as Observable<ApiDetail>;
      })) as Observable<ApiDetail>;
  }
}
