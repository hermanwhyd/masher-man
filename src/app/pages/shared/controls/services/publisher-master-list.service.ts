import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiDetail } from 'src/app/types/api.interface';

@Injectable({
  providedIn: 'root'
})
export class PublisherMasterListService {

  public publishEmit = new Subject<string[]>();
  public publishEmit$ = this.publishEmit.asObservable();

  public refreshEmit = new Subject<string>();
  public refreshEmit$ = this.refreshEmit.asObservable();

  public createEmit = new BehaviorSubject<ApiDetail>(null);
  public createEmit$ = this.createEmit.asObservable();

  constructor() { }
}
