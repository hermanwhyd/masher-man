export interface GenericRs<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}
