import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';

/**
 * Date interceptor for modify request body payload.
 * All field with type Date will convert to isoDate local timezone.
 *
 * https://dev.to/imben1109/date-handling-in-angular-application-part-2-angular-http-client-and-ngx-datepicker-3fna
 */
export class JsonDateInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and convert body
    const body = this.convert(req.body);
    const reqCopy = req.clone({
      body
    });

    return next.handle(reqCopy);
  }

  isDateObject(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    return value instanceof Date;
  }

  convert(body: any) {
    if (body === null || body === undefined) {
      return body;
    }

    if (typeof body !== 'object') {
      return body;
    }

    for (const key of Object.keys(body)) {
      const value = body[key];
      if (this.isDateObject(value)) {
        body[key] = DateTime.fromJSDate(value).toISO();
      } else if (typeof value === 'object') {
        this.convert(value);
      }
    }
  }
}
