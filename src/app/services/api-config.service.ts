import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ApiConfig, Profile } from '../types/api-config.interface';

const STORAGE_KEY_CONFIGS = 'MasherMan-ApiConfigs';
const STORAGE_KEY_PROFILES = 'MasherMan-ApiProfiles';
const STORAGE_KEY_CONFIG_API = 'MasherMan-ConfigAPI';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  configApi = new BehaviorSubject<string>(this.storage.get(STORAGE_KEY_CONFIG_API) || '');
  configApi$ = this.configApi.asObservable();

  profiles = new BehaviorSubject<Profile[]>(this.storage.get(STORAGE_KEY_PROFILES) || []);
  profiles$ = this.profiles.asObservable();

  configs = new BehaviorSubject<ApiConfig[]>(this.storage.get(STORAGE_KEY_CONFIGS) || [] as ApiConfig[]);
  configs$ = this.configs.asObservable();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private http: HttpClient) {
    this.configs$.subscribe(c => this.storage.set(STORAGE_KEY_CONFIGS, c));
    this.configApi$.subscribe(c => this.storage.set(STORAGE_KEY_CONFIG_API, c));
    this.profiles$.subscribe(c => {
      this.storage.set(STORAGE_KEY_PROFILES, c);
      // set configs active
      const name = this.getActiveProfile()?.name;
      const configs = this.configs.value;
      configs.forEach(p => p.active = (p.profile === name) ? true : false);
      this.configs.next(configs);
    });
  }

  public getProfile(url: string) {
    return this.http.get(url).pipe(filter<Profile[]>(Boolean)) as Observable<Profile[]>;
  }

  public getActiveProfile() {
    return this.profiles.value.find(p => p.active === true);
  }

  public getActiveConfig() {
    return this.configs.value.find(p => p.active === true);
  }
}
