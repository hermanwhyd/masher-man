import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Account, Profile, User } from '../types/api-config.interface';
import { Tier } from '../types/tier.interface';

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

  subscriptionTiers = new BehaviorSubject<Tier[]>([]);
  subscriptionTiers$ = this.subscriptionTiers.asObservable();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private http: HttpClient) {
    this.accounts$.subscribe(c => {
      this.storage.set(STORAGE_KEY_ACCOUNTS, c);

      this.subscriptionTiers.next(this.getActiveAccount()?.tiers || []);
    });

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
    return this.getActiveAccount()?.userPublishers.find(p => p.active === true);
  }

  public getActiveStore() {
    return this.getActiveAccount()?.userStores.find(p => p.active === true);
  }

  public setActiveProfile(profile: Profile) {
    this.profiles.value.forEach(p => p.active = p === profile ? true : false);
    this.profiles.next(this.profiles.value);
  }

  public setActiveAccountPublisher(user: User) {
    this.getActiveAccount()?.userPublishers.forEach(p => p.active = p === user ? true : false);
    this.accounts.next(this.accounts.value);
  }

  public setActiveAccountStore(user: User) {
    this.getActiveAccount()?.userStores.forEach(p => p.active = p === user ? true : false);
    this.accounts.next(this.accounts.value);
  }

  public setActiveAccountApiManager(user: User) {
    this.getActiveAccount()?.userApiManagers.forEach(p => p.active = p === user ? true : false);
    this.accounts.next(this.accounts.value);
  }

  updateSubsTiers(list: Tier[]) {
    const curr = this.subscriptionTiers.value;
    list.forEach(t => {
      t.selected = t.selected || curr.find(f => f.name === t.name)?.selected || false;
    });

    this.subscriptionTiers.next(list);
  }

  updateSelectedSubsTier(selected: string[]) {
    const curr = this.subscriptionTiers.value;
    curr.forEach(t => {
      t.selected = selected.includes(t.name);
    });

    const tmp = this.accounts.value;
    tmp.forEach(a => {
      if (a.active) {
        a.tiers = curr;
      }
    });

    this.accounts.next(tmp);
  }

  updateDefaultSubsTier(name: string) {
    const curr = this.subscriptionTiers.value;
    curr.forEach(t => {
      t.default = name === t.name;
    });

    const tmp = this.accounts.value;
    tmp.forEach(a => {
      if (a.active) {
        a.tiers = curr;
      }
    });

    this.accounts.next(tmp);
  }

  public getSelectedSubsTier() {
    return this.subscriptionTiers?.value.filter(f => f.selected);
  }

  public getDefaultSubsTier() {
    return this.subscriptionTiers?.value.find(f => f.default);
  }
}
