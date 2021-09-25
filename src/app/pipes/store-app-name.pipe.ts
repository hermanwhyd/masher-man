import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreService } from '../pages/store/services/store.service';

@Pipe({
  name: 'storeAppName'
})
export class StoreAppNamePipe implements PipeTransform {

  constructor(private storeService: StoreService) { }

  transform(appId: string, ...args: any[]): Observable<string> {
    return this.storeService.getApplicationDetail(appId).pipe(
      map(({ name }) => name)
    );
  }
}
