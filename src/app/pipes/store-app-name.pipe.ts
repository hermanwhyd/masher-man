import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationService } from '../services/application.service';

@Pipe({
  name: 'storeAppName'
})
export class StoreAppNamePipe implements PipeTransform {

  constructor(private applicationService: ApplicationService) { }

  transform(appId: string, ...args: any[]): Observable<string> {
    return this.applicationService.getApplicationDetail(appId).pipe(
      map(({ name }) => name)
    );
  }
}
