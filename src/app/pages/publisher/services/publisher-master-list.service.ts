import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiDetail } from 'src/app/types/api.interface';

@Injectable({
  providedIn: 'root'
})
export class PublisherMasterListService {

  public publishEmit = new BehaviorSubject<string[]>(null);
  public publishEmit$ = this.publishEmit.asObservable();

  public refreshEmit = new BehaviorSubject<string>(null);
  public refreshEmit$ = this.refreshEmit.asObservable();

  public createEmit = new BehaviorSubject<ApiDetail>(null);
  public createEmit$ = this.createEmit.asObservable();

  constructor() { }
}
