
export interface GenericPagingRs<T> {
  data: T;
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_page: number;
}
