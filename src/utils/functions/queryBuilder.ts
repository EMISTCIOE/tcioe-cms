import { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { camelCaseToSnakeCase } from './formatString';

export interface IQueryParams {
  search: string;
  paginationModel?: GridPaginationModel;
  sortModel?: GridSortModel;
  filterModel?: GridFilterModel;
  filters?: Record<string, string | number | boolean | undefined | null>;
}

export const getQueryParams = ({ search, paginationModel, sortModel, filterModel, filters }: IQueryParams) => {
  const { page, pageSize } = paginationModel!;

  // Ordering
  const orderingField = sortModel?.[0]?.field;
  const ordering = orderingField ? camelCaseToSnakeCase(orderingField) : '';
  const direction = sortModel?.[0]?.sort === 'asc' ? '' : '-';
  const orderingString = ordering ? `${direction}${ordering}` : '';

  // Filtering
  const dataGridFilters =
    filterModel?.items
      ?.filter((item) => item.field && item.value !== undefined && item.value !== null && item.value !== '')
      .map((item) => ({
        field: camelCaseToSnakeCase(item.field as string),
        value: item.value
      })) ?? [];

  const staticFilters = filters
    ? Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([field, value]) => ({
          field: camelCaseToSnakeCase(field),
          value
        }))
    : [];

  const filterString = [...dataGridFilters, ...staticFilters]
    .map((item) => `${item.field}=${encodeURIComponent(String(item.value))}`)
    .join('&');

  return {
    page,
    pageSize,
    orderingString,
    filterString,
    search
  };
};
