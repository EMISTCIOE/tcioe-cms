import { Theme } from '@mui/material/styles';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { ICampusFeedbacksItem } from '../../redux/types';

export interface ITableData extends Omit<ICampusFeedbacksItem, 'isResolved'> {
  actions?: string;
  isResolved: 'true' | 'false'; // Convert boolean to string for select options,
}
const IResolvedColorMap: BadgeColorMap = {
  RESOLVED: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  UNRESOLVED: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<ITableData>[] => [
  { field: 'fullName', headerName: 'FULL NAME', type: 'text', sortable: true, editable: false },
  { field: 'rollNumber', headerName: 'ROLL NO.', type: 'text', editable: false },
  { field: 'email', headerName: 'EMAIL', type: 'text', minWidth: 180, editable: false },
  { field: 'message', headerName: 'MESSAGE', type: 'text', minWidth: 180, editable: false },
  {
    field: 'isResolved',
    headerName: 'RESOLVED STATUS',
    type: 'select',
    filterable: true,
    sortable: true,
    valueOptions: [
      { label: 'Resolved', value: 'true' },
      { label: 'Unresolved', value: 'false' }
    ],
    colorMap: IResolvedColorMap
  },
  { field: 'createdAt', headerName: 'CREATED AT', type: 'date', sortable: true, editable: false },
  { field: 'actions', headerName: '', type: 'actions' }
];
