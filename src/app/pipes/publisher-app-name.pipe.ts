import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PublisherService } from '../pages/publisher/services/publisher.service';

@Pipe({
  name: 'publisherAppName'
})
export class PublisherAppNamePipe implements PipeTransform {

  constructor(private publisherService: PublisherService) { }

  transform(appId: string, ...args: any[]): Observable<string> {
    return this.publisherService.getApplicationDetail(appId)
      .pipe(
        map(({ name, subscriber }) => subscriber + ' | ' + name)
      );
  }

}
