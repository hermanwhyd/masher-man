import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import * as _ from 'lodash';
import { LoginRq } from './oauth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_NAME = 'JWT_TOKEN';

  private readonly URL_REGISTER = 'https://portal.egw.xl.co.id/client-registration/v0.13/register';
  private readonly URL_LOGIN = 'https://gateway.egw.xl.co.id/token';

  constructor(private http: HttpClient, @Inject(LOCAL_STORAGE) private storage: StorageService) { }

  login(user: LoginRq) {
    return this.http.post(this.URL_LOGIN, user)
      .pipe(
        tap(rs => console.log(rs)),
      ) as Observable<LoginRq>;
  }
}
