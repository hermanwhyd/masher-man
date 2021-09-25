import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vex-jsonform-empty',
  styles: [`
  :host {
    @apply flex-auto flex flex-col;
  }.vex-view-empty {
    background: linear-gradient(135deg, var(--background-card) 22px, var(--background-hover) 22px, var(--background-hover) 24px, transparent 24px, transparent 67px, var(--background-hover) 67px, var(--background-hover) 69px, transparent 69px),
    linear-gradient(225deg, var(--background-card) 22px, var(--background-hover) 22px, var(--background-hover) 24px, transparent 24px, transparent 67px, var(--background-hover) 67px, var(--background-hover) 69px, transparent 69px) 0 64px;
    background-color: var(--background-card);
    background-size: 64px 128px;
  }
`],
  template: `
    <div class="vex-view-empty flex-auto flex flex-col justify-center items-center p-gutter">
      <img class="w-full max-w-md" src="assets/img/illustrations/data_center.svg"/>
      <p class="text-xl font-semibold mt-4">Please add new item to list</p>
    </div>
  `
})
export class JsonformEmptyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
