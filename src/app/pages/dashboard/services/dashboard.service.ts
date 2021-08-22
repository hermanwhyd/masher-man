import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/common/api.config';
import { GenericRs } from 'src/app/types/generic-rs.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly URL = [ApiConfig.url, 'v1', 'dashboard'].join('/');

  constructor(private httpClient: HttpClient) { }

  private joiner(...str: any[]) {
    return [this.URL, ...str].join('/');

  }
}
