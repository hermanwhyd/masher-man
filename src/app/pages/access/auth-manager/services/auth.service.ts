import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRq, RegisterRq, RegisterRs } from './oauth.interface';
import { DeepPartial } from 'src/@vex/interfaces/deep-partial.type';
import { ApiConfigService } from 'src/app/services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiConfigService: ApiConfigService,
    private http: HttpClient) { }

  token(user: DeepPartial<LoginRq>, digest: string) {
    const body = new HttpParams()
      .set('grant_type', user.grant_type)
      .set('username', user.username)
      .set('password', user.password)
      .set('scope', user.scope);

    const headers = new HttpHeaders({ Authorization: `Basic ${digest}`, 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post([
      this.apiConfigService.configApi.value,
      this.apiConfigService.getActiveProfile()?.name,
      'token'
    ].join('/'), body.toString(), { headers }).pipe(tap(rs => console.log(rs))) as Observable<LoginRq>;
  }

  register(user: DeepPartial<RegisterRq>, digest: string) {
    const headers = new HttpHeaders({ Authorization: `Basic ${digest}` });
    return this.http.post([
      this.apiConfigService.configApi.value,
      this.apiConfigService.getActiveProfile()?.name,
      'register'
    ].join('/'), user, { headers }).pipe(tap(rs => console.log(rs))) as Observable<RegisterRs>;
  }

}
