import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ApiConfig } from 'src/app/common/api.config';
import { LoginRq } from './interfaces/login-rq.interface';
import { JwtClaim } from './interfaces/jwt-claim.model';
import jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import { JwtRs } from './interfaces/jwt-rs.interface';
import { GenericRs } from '../types/generic-rs.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_NAME = 'JWT_TOKEN';

  private readonly URL_LOGIN = ApiConfig.url + '/auth/signin/web';
  private readonly URL_REFRESH = ApiConfig.url + '/auth/signin/web/refresh';

  constructor(private http: HttpClient, @Inject(LOCAL_STORAGE) private storage: StorageService) { }

  login(user: LoginRq): Observable<string> {
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    headers.append('Content-Type', 'application/json');

    return this.http.post<GenericRs<JwtRs>>(this.URL_LOGIN, user, { headers })
      .pipe(
        tap(rs => this.doLoginUser(rs.data)),
        mapTo('OK'),
        catchError(err => {
          return of(err.error.message);
        })
      );
  }

  logout() {
    this.doLogoutUser();
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.get(this.URL_REFRESH)
      .pipe(tap((loginRs: GenericRs<JwtRs>) => {
        this.storeJwtToken(loginRs.data.token);
      }));
  }

  getJwtToken() {
    return this.storage.get(this.TOKEN_NAME);
  }

  getJwtClaim(): JwtClaim {
    const token = this.getJwtToken();
    if (token === undefined) { return null; }

    return jwt_decode(token);
  }

  hasAccess(auths: string[]): boolean {
    const claim = this.getJwtClaim();
    if (claim === null) { return true; }

    const authorises = claim.roles;
    const result = _.intersection(auths, authorises);
    return result.length > 0;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) { token = this.getJwtToken(); }
    if (!token) { return true; }

    const claim = this.getJwtClaim();
    if (claim.exp === undefined) { return true; }

    const date = new Date(0);
    date.setUTCSeconds(claim.exp);

    if (date === undefined) { return false; }
    return !(date.valueOf() > new Date().valueOf());
  }

  private doLoginUser(tokens: JwtRs) {
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.removeTokens();
  }

  private storeJwtToken(jwt: string) {
    this.storage.set(this.TOKEN_NAME, jwt);
  }

  private storeTokens(tokens: JwtRs) {
    this.storage.set(this.TOKEN_NAME, tokens.token);
  }

  private removeTokens() {
    this.storage.remove(this.TOKEN_NAME);
  }
}
