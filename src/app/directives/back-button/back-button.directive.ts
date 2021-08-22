import { Directive, HostListener, Input } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Directive({
  selector: '[vexBackButton]'
})
export class BackButtonDirective {

  @Input('vexBackButton') defaultRoute: string;

  constructor(private navigation: NavigationService) { }

  @HostListener('click')
  onClick(): void {
    this.navigation.back(this.defaultRoute);
  }

}
