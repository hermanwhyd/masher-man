import { SharedProperty } from 'src/app/types/shared-property.interface';

/**
 * Compare object
 */
export function compareObject(o1: any, o2: any) {
  return o1 === o2;
}

/**
 * Compare object.id
 */
export function compareObjectId(o1: any, o2: any) {
  return o1?.id === o2?.id;
}

/**
 * Compare enum object
 */
export function compareEnum(o1: SharedProperty, o2: SharedProperty) {
  return o1?.code === o2?.code;
}
