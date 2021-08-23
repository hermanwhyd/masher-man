import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from 'src/app/types/api.interface';
import { Paginate } from 'src/app/types/paginate.interface';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  private readonly URL = 'https://portal.egw.xl.co.id/api/am/publisher/v0.13/apis';

  constructor(private httpClient: HttpClient) { }

  public getSwaggerJson(url: string) {
    return this.httpClient.get(url) as Observable<any>;
  }

  public paginate(offset: number, limit: number, query?: string) {
    let params = new HttpParams().append('offset', offset).append('limit', limit);
    if (query) {
      params = params.append('query', query);
    }
    return this.httpClient.get(this.URL, { params }) as Observable<Paginate<Api>>;
  }
}
