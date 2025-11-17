import { Theme } from '@mui/material/styles';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { IDepartment } from '../../redux/types';

export interface ITableData extends Omit<IDepartment, 'is_active'> {
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<ITableData>[] => [
  { field: 'thumbnail', headerName: 'THUMBNAIL', type: 'image' },
  { field: 'name', headerName: 'NAME', type: 'text', sortable: true, minWidth: 220 },
  { field: 'short_name', headerName: 'SHORT NAME', type: 'text', minWidth: 140 },
  { field: 'slug', headerName: 'SLUG', type: 'text', minWidth: 160 },
  { field: 'brief_description', headerName: 'BRIEF DESCRIPTION', type: 'text', minWidth: 420 },
  { field: 'phone_no', headerName: 'PHONE', type: 'text', minWidth: 140 },
  { field: 'email', headerName: 'EMAIL', type: 'text', minWidth: 200 },
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
  { field: 'actions', headerName: '', type: 'actions' }
];
