import { Inject, Injectable } from '@angular/core';
import { StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject } from 'rxjs';
import { ApiConfig } from '../types/api-config.interface';

const STORAGE_KEY = 'MasherMan-ApiConf';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  config = new BehaviorSubject<ApiConfig>(this.storage.get(STORAGE_KEY) || {} as ApiConfig);
  config$ = this.config.asObservable();

  constructor(@Inject(STORAGE_KEY) private storage: StorageService) {
    this.config$.subscribe(c => this.storeConfig(c));
  }

  private storeConfig(config: ApiConfig) {
    this.storage.set(STORAGE_KEY, config);
  }
}
