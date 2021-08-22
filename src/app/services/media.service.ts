import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../common/api.config';
import { GenericRs } from '../types/generic-rs.interface';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly URL = [ApiConfig.url, 'media'].join('/');

  constructor(private httpClient: HttpClient) { }

  public downloadSigle(uuid: string) {
    return this.httpClient.get([this.URL, uuid, 'download'].join('/'), { responseType: 'blob' }) as Observable<any>;
  }

  public delete(uuid: string) {
    return this.httpClient.delete(`${this.URL}/${uuid}`) as Observable<GenericRs<void>>;
  }
}
