import { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { camelCaseToSnakeCase } from './formatString';

export interface IQueryParams {
  search: string;
  paginationModel?: GridPaginationModel;
  sortModel?: GridSortModel;
  filterModel?: GridFilterModel;
}

export const getQueryParams = ({ search, paginationModel, sortModel, filterModel }: IQueryParams) => {
  const { page, pageSize } = paginationModel!;

  // Ordering
  const orderingField = sortModel?.[0]?.field;
  const ordering = orderingField ? camelCaseToSnakeCase(orderingField) : '';
  const direction = sortModel?.[0]?.sort === 'asc' ? '' : '-';
  const orderingString = ordering ? `${direction}${ordering}` : '';

  // Filtering
  const filterItems =
    filterModel?.items
      ?.filter((item) => item.field && item.value !== undefined && item.value !== null && item.value !== '')
      .map((item) => ({
        field: camelCaseToSnakeCase(item.field as string),
        value: item.value
      })) ?? [];
  const filterString = filterItems.map((item) => `${item.field}=${item.value}`).join('&');

  return {
    page,
    pageSize,
    orderingString,
    filterString,
    search
  };
};
