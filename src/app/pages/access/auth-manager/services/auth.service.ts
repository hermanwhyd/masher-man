import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginRq, LoginRs, RegisterRq, RegisterRs } from './oauth.interface';
import { DeepPartial } from 'src/@vex/interfaces/deep-partial.type';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { CookieService } from 'ngx-cookie-service';
import { DateTime } from 'luxon';
import { encodeDigest } from 'src/app/utilities/function/base64-util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private cookieSvc: CookieService,
    private apiConfigService: ApiConfigService,
    private http: HttpClient) { }

  token(user: DeepPartial<LoginRq>, clientDigest: string) {
    const cookieKey = clientDigest + '|' + user.scope;
    if (this.getToken(cookieKey)) {
      return of(this.getToken(cookieKey));
    }

    const body = new HttpParams()
      .set('grant_type', user.grant_type)
      .set('username', user.username)
      .set('password', user.password)
      .set('scope', user.scope);

    const headers = new HttpHeaders({ Authorization: `Basic ${clientDigest}`, 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post([
      this.apiConfigService.proxyApi.value,
      this.apiConfigService.getActiveProfile()?.name, 'token'].join('/'), body.toString(), { headers })
      .pipe(
        tap((rs: LoginRs) => this.storeToken(cookieKey, rs.access_token, rs.expires_in)),
        map((rs) => rs.access_token)
      );
  }

  tokenClientCredential(consumerKey: string, consumerSecret: string) {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', consumerKey)
      .set('client_secret', consumerSecret)
      ;

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post([
      this.apiConfigService.proxyApi.value,
      this.apiConfigService.getActiveProfile()?.name, 'token'].join('/'), body.toString(), { headers })
      .pipe(map((rs: any) => rs.access_token));
  }

  register(user: DeepPartial<RegisterRq>, digest: string) {
    const headers = new HttpHeaders({ Authorization: `Basic ${digest}` });
    return this.http.post([
      this.apiConfigService.proxyApi.value,
      this.apiConfigService.getActiveProfile()?.name,
      'register'
    ].join('/'), user, { headers }) as Observable<RegisterRs>;
  }

  private getToken(key: string) {
    return this.cookieSvc.get(key);
  }

  private storeToken(key: string, token: string, expires: number) {
    this.cookieSvc.set(key, token, { expires: DateTime.local().plus({ seconds: expires }).toJSDate() });
  }
}
