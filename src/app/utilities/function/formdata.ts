import { DateTime } from 'luxon';
import moment from 'moment';

/**
 * Convert object to FormData
 */
export function convertToFormData(data: any, formData: FormData, parentKey?: string) {
  if (data === null || data === undefined) { return null; }

  formData = formData || new FormData();

  if (typeof data === 'object' && !moment.isMoment(data) && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key =>
      convertToFormData(data[key], formData, (!parentKey ? key : (data[key] instanceof File ? parentKey : `${parentKey}[${key}]`)))
    );
  } else if (data instanceof Date) {
    formData.append(parentKey, DateTime.fromJSDate(data).toISO());
  } else if (moment.isMoment(data)) {
    formData.append(parentKey, DateTime.fromJSDate(data.toDate()).toISO());
  } else {
    formData.append(parentKey, data);
  }

  return formData;
}
