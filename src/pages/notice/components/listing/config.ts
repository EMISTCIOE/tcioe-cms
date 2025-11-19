import { Theme } from '@mui/material/styles';
import { INoticeItem, NoticeStatus } from '../../redux/types';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { enumToOptions } from '@/utils/functions/formatString';
import { GridRowId, GridRowParams } from '@mui/x-data-grid';

export interface ITableData extends Omit<INoticeItem, 'isFeatured' | 'isApprovedByDepartment' | 'isApprovedByCampus'> {
  actions?: string;
  isFeatured: 'true' | 'false'; // Convert boolean to string for select options
  isApprovedByDepartment?: 'true' | 'false';
  isApprovedByCampus?: 'true' | 'false';
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

const IsApprovedColorMap: BadgeColorMap = {
  YES: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  NO: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (
  theme: Theme,
  categoryOptions: ColumnConfig<ITableData>['valueOptions'],
  departmentOptions: ColumnConfig<ITableData>['valueOptions'],
  canUpdateStatus: boolean,
  onStatusChange: (id: GridRowId, value: ITableData[keyof ITableData]) => Promise<void>,
  onApprovalChange: (
    id: GridRowId,
    field: 'isApprovedByDepartment' | 'isApprovedByCampus',
    value: ITableData[keyof ITableData]
  ) => Promise<void>,
  customActions: ((params: GridRowParams<ITableData>) => JSX.Element)[]
): ColumnConfig<ITableData>[] => [
  { field: 'thumbnail', headerName: 'THUMBNAIL', type: 'image', minWidth: 80 },
  { field: 'title', headerName: 'TITLE', type: 'text', minWidth: 250 },
  {
    field: 'category',
    headerName: 'CATEGORY',
    type: 'select',
    editable: true,
    minWidth: 150,
    valueOptions: categoryOptions,
    filterable: true
  },
  {
    field: 'department',
    headerName: 'DEPARTMENT',
    type: 'select',
    editable: true,
    minWidth: 200,
    valueOptions: departmentOptions,
    filterable: true,
    visible: false
  },
  { field: 'authorName', headerName: 'AUTHOR', type: 'text', editable: false, minWidth: 150 },
  { field: 'publishedAt', headerName: 'PUBLISHED', type: 'date', sortable: true, editable: false, minWidth: 120 },
  {
    field: 'isFeatured',
    headerName: 'FEATURED',
    type: 'select',
    filterable: true,
    minWidth: 100,
    valueOptions: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    colorMap: IsFeaturedColorMap
  },
  {
    field: 'isApprovedByDepartment',
    headerName: 'DEPT',
    type: 'select',
    filterable: true,
    minWidth: 90,
    valueOptions: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    colorMap: IsApprovedColorMap,
    editable: true,
    handleChange: (id, value) => onApprovalChange(id, 'isApprovedByDepartment', value)
  },
  {
    field: 'isApprovedByCampus',
    headerName: 'CAMPUS',
    type: 'select',
    filterable: true,
    minWidth: 100,
    valueOptions: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    colorMap: IsApprovedColorMap,
    editable: true,
    handleChange: (id, value) => onApprovalChange(id, 'isApprovedByCampus', value)
  },
  {
    field: 'status',
    headerName: 'STATUS',
    type: 'select',
    filterable: true,
    minWidth: 120,
    valueOptions: [...enumToOptions(NoticeStatus)],
    colorMap: StatusColorMap,
    editable: canUpdateStatus,
    handleChange: (id, value) => onStatusChange(id, value)
  },
  {
    field: 'actions',
    headerName: 'ACTIONS',
    type: 'actions',
    minWidth: 120,
    customActions
  }
];
