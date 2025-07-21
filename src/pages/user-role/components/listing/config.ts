import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { Theme } from '@mui/material/styles';
import { UserRole } from '../../redux/types';

export interface TableData extends Omit<UserRole, 'isActive'> {
  name: string;
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}

const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<TableData>[] => [
  { field: 'name', headerName: 'NAME', type: 'text', filterable: true },
  { field: 'codename', headerName: 'CODE NAME', type: 'text', filterable: true, sortable: true },
  {
    field: 'isActive',
    headerName: 'ACTIVE STATUS',
    type: 'select',
    filterable: true,
    valueOptions: [
      { label: 'Active', value: 'true' },
      { label: 'InActive', value: 'false' }
    ],
    colorMap: IsActiveColorMap
  },
  { field: 'createdAt', headerName: 'CREATED AT', type: 'date', editable: false, sortable: true },
  { field: 'actions', headerName: '', type: 'actions' }
];
