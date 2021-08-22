import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(private httpClient: HttpClient) { }

  public getSwaggerJson(url: string) {
    return this.httpClient.get(url) as Observable<any>;
  }
}
