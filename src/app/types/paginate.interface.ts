export interface Paginate<T> {
  count?: number;
  list?: T[];
  pagination?: PaginateSummary;
}

export interface PaginateSummary {
  total: number;
  offset: number;
  limit: number;
}
