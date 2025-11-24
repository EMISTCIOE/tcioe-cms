import { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export type BackendError = {
  status: number;
  data: Record<string, string>;
};

export interface IRequiredPermission {
  view: string | string[];
  edit: string | string[];
  add: string | string[];
  delete: string | string[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface IListResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IListQueryParams {
  search: string;
  paginationModel?: GridPaginationModel;
  sortModel?: GridSortModel;
  filterModel?: GridFilterModel;
  filters?: Record<string, string | number | boolean | undefined | null>;
}

export interface IMutationSuccessResponse {
  id?: string;
  message?: string;
  is_internal?: boolean;
}
