import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from '../pages/access/auth-manager/services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class CommonHeadersInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        ContentType: 'application/json',
        Accept: 'application/json'
      }
    });
    return next.handle(request);
  }
}
