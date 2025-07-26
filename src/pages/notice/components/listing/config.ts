import { Theme } from '@mui/material/styles';
import { INoticeItem, NoticeStatus } from '../../redux/types';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { enumToOptions } from '@/utils/functions/formatString';
import { GridRowId, GridRowParams } from '@mui/x-data-grid';

export interface ITableData extends Omit<INoticeItem, 'isFeatured'> {
  actions?: string;
  isFeatured: 'true' | 'false'; // Convert boolean to string for select options
}

const StatusColorMap: BadgeColorMap = {
  DRAFT: { backgroundColor: 'secondary.lighter', color: 'secondary.main' },
  APPROVED: { backgroundColor: 'success.lighter', color: 'success.main' },
  REJECTED: { backgroundColor: 'error.lighter', color: 'error.main' },
  PENDING: { backgroundColor: 'warning.lighter', color: 'warning.main' }
};

const IsFeaturedColorMap: BadgeColorMap = {
  YES: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  NO: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (
  theme: Theme,
  categoryOptions: ColumnConfig<ITableData>['valueOptions'],
  departmentOptions: ColumnConfig<ITableData>['valueOptions'],
  canUpdateStatus: boolean,
  onStatusChange: (id: GridRowId, value: ITableData[keyof ITableData]) => Promise<void>,
  customActions: ((params: GridRowParams<ITableData>) => JSX.Element)[]
): ColumnConfig<ITableData>[] => [
  { field: 'thumbnail', headerName: 'THUMBNAIL', type: 'image' },
  { field: 'title', headerName: 'TITLE', type: 'text', minWidth: 200 },
  {
    field: 'department',
    headerName: 'DEPARTMENT',
    type: 'select',
    editable: true,
    minWidth: 380,
    valueOptions: departmentOptions,
    filterable: true
  },
  {
    field: 'category',
    headerName: 'CATEGORY',
    type: 'select',
    editable: true,
    minWidth: 200,
    valueOptions: categoryOptions,
    filterable: true
  },
  { field: 'authorName', headerName: 'AUTHOR', type: 'text', editable: false },
  { field: 'publishedAt', headerName: 'PUBLISHED AT', type: 'date', sortable: true, editable: false },
  {
    field: 'isFeatured',
    headerName: 'FEATURED',
    type: 'select',
    filterable: true,
    valueOptions: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    colorMap: IsFeaturedColorMap
  },
  {
    field: 'status',
    headerName: 'STATUS',
    type: 'select',
    filterable: true,
    valueOptions: [...enumToOptions(NoticeStatus)],
    colorMap: StatusColorMap,
    editable: canUpdateStatus,
    handleChange: (id, value) => onStatusChange(id, value)
  },
  {
    field: 'actions',
    headerName: 'ACTIONS',
    type: 'actions',
    customActions
  }
];
