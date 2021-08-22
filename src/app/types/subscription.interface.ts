import { SharedProperty } from './shared-property.interface';

export interface Subscription {
  id: number;
  subscriber: SharedProperty;
}
