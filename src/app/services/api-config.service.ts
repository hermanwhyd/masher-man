import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Account, Profile, User } from '../types/api-config.interface';

const STORAGE_KEY_ACCOUNTS = 'MasherMan-Accounts';
const STORAGE_KEY_PROFILES = 'MasherMan-ApiProfiles';
const STORAGE_KEY_CONFIG_API = 'MasherMan-ProxyAPI';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  proxyApi = new BehaviorSubject<string>(this.storage.get(STORAGE_KEY_CONFIG_API) || '');
  proxyApi$ = this.proxyApi.asObservable();

  profiles = new BehaviorSubject<Profile[]>(this.storage.get(STORAGE_KEY_PROFILES) || []);
  profiles$ = this.profiles.asObservable();

  accounts = new BehaviorSubject<Account[]>(this.storage.get(STORAGE_KEY_ACCOUNTS) || []);
  accounts$ = this.accounts.asObservable();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private http: HttpClient) {
    this.accounts$.subscribe(c => this.storage.set(STORAGE_KEY_ACCOUNTS, c));
    this.proxyApi$.subscribe(c => this.storage.set(STORAGE_KEY_CONFIG_API, c));
    this.profiles$.subscribe(c => {
      this.storage.set(STORAGE_KEY_PROFILES, c);
      // set accounts active
      const name = this.getActiveProfile()?.name;
      const accounts = this.accounts.value;
      accounts.forEach(p => p.active = (p.profile === name) ? true : false);
      this.accounts.next(accounts);
    });
  }

  getApiUrl() {
    return [this.proxyApi.value, this.getActiveProfile()?.name].join('/');
  }

  public getProfile(url: string) {
    return this.http.get(url).pipe(filter<Profile[]>(Boolean)) as Observable<Profile[]>;
  }

  public getActiveProfile() {
    return this.profiles.value.find(p => p.active === true);
  }

  public getActiveAccount() {
    return this.accounts.value.find(p => p.active === true);
  }

  public getActivePublisher() {
    return this.getActiveAccount().userPublishers.find(p => p.active === true);
  }

  public setActiveProfile(profile: Profile) {
    this.profiles.value.forEach(p => p.active = p === profile ? true : false);
    this.profiles.next(this.profiles.value);
  }

  public setActiveAccountPublisher(user: User) {
    this.getActiveAccount().userPublishers.forEach(p => p.active = p === user ? true : false);
    this.accounts.next(this.accounts.value);
  }

  public setActiveAccountStore(user: User) {
    this.getActiveAccount().userStores.forEach(p => p.active = p === user ? true : false);
    this.accounts.next(this.accounts.value);
  }

  public setActiveAccountApiManager(user: User) {
    this.getActiveAccount().userApiManagers.forEach(p => p.active = p === user ? true : false);
    this.accounts.next(this.accounts.value);
  }
}
