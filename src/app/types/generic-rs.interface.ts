export interface GenericRs<T> {
  status: string;
  message: string;
  data: T;
}
