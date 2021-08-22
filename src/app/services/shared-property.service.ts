import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { EMPTY, Observable, of } from 'rxjs';
import { map, publishReplay, refCount, catchError, isEmpty, filter } from 'rxjs/operators';
import { GenericRs } from 'src/app/types/generic-rs.interface';
import { SharedProperty } from 'src/app/types/shared-property.interface';
import { ApiConfig } from '../common/api.config';

@Injectable({
  providedIn: 'root'
})
export class SharedPropertyService {

  private STORAGE_KEY = 'dashboard-greeting';
  private TIME_TO_KEEP = 10000; // in milis

  private readonly URL = ApiConfig.url + '/v1/shared-props';
  sharedPropGroupCache = {};
  sharedPropOptionCache = {};

  constructor(private httpClient: HttpClient, @Inject(LOCAL_STORAGE) private _storage: StorageService) { }

  public deleteCacheItem(key: string) {
    delete this.sharedPropGroupCache[key];
    delete this.sharedPropOptionCache[key];
  }

  public storeSharePropCache(types: SharedProperty[]) {
    this._storage.set(this.STORAGE_KEY, types);
  }

  public getSharedPropCache(): SharedProperty[] {
    return this._storage.get(this.STORAGE_KEY) || [] as SharedProperty[];
  }

  public findFullByGroup(group: string, include?: string) {
    let params = new HttpParams().append('mode', 'edit');
    if (include !== undefined) { params = params.append('include', include); }
    return this.httpClient.get([this.URL, 'group', group].join('/'), { params }) as Observable<GenericRs<SharedProperty[]>>;
  }

  public findByGroup(group: string, include?: string) {
    const params = include ? { include } : null;

    if (!this.sharedPropGroupCache[group]) {
      this.sharedPropGroupCache[group] = this.httpClient.get([this.URL, 'group', group].join('/'), { params })
        .pipe(
          map(data => data),
          publishReplay(1, this.TIME_TO_KEEP),
          refCount(),
          catchError(() => {
            this.deleteCacheItem(group);
            return EMPTY;
          })
        );
    }

    if (!this.sharedPropGroupCache[group]) {
      this.sharedPropGroupCache[group] = of();
    }

    this.sharedPropGroupCache[group]
      .pipe(isEmpty())
      .subscribe((empty: boolean) => {
        if (empty) {
          this.sharedPropGroupCache[group] = this.httpClient.get([this.URL, 'group', group].join('/'), { params })
            .pipe(
              map(data => data),
              publishReplay(1, this.TIME_TO_KEEP),
              refCount(),
              catchError(() => {
                this.deleteCacheItem(group);
                return EMPTY;
              })
            );
        }
      });

    return this.sharedPropGroupCache[group] as Observable<GenericRs<SharedProperty[]>>;
  }

  public update(bodyRq: SharedProperty[]): Observable<GenericRs<void>> {
    return this.httpClient.put([this.URL, 'batch-update'].join('/'), bodyRq) as Observable<GenericRs<void>>;
  }

  public saveOrUpdate(model: SharedProperty) {
    if (model.id) {
      return this.httpClient.put([this.URL, model.id].join('/'), model) as Observable<GenericRs<SharedProperty>>;
    } else {
      return this.httpClient.post(this.URL, model) as Observable<GenericRs<SharedProperty>>;
    }
  }


  public delete(id: number) {
    return this.httpClient.delete([this.URL, id].join('/')) as Observable<GenericRs<void>>;
  }

  public getSelectOptions(selector: string, params?: any) {
    let httpParams = new HttpParams();
    if (params !== undefined) {
      Object.keys(params).forEach(key => httpParams = httpParams.append(key, params[key]));
    }

    if (!this.sharedPropOptionCache[selector]) {
      this.sharedPropOptionCache[selector] = of();
    }

    this.sharedPropOptionCache[selector]
      .pipe(isEmpty())
      .subscribe((empty: boolean) => {
        if (empty) {
          this.sharedPropOptionCache[selector] = this.httpClient.get([this.URL, 'options', selector].join('/'), { params: httpParams })
            .pipe(
              map(data => data),
              publishReplay(1, 10000),
              refCount(),
              catchError(() => {
                this.deleteCacheItem(selector);
                return EMPTY;
              })
            );
        }
      });

    return this.sharedPropOptionCache[selector] as Observable<GenericRs<any>>;
  }
}
