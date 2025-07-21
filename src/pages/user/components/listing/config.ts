import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { Theme } from '@mui/material/styles';
import { UserItem } from '../../redux/types';

export interface TableData extends Omit<UserItem, 'middleName' | 'lastName' | 'isActive'> {
  firstName: string;
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<TableData>[] => [
  { field: 'photo', headerName: 'PHOTO', type: 'image' },
  { field: 'username', headerName: 'USER NAME', type: 'text', editable: false, filterable: true },
  { field: 'firstName', headerName: 'NAME', type: 'text', sortable: true },
  { field: 'phoneNo', headerName: 'PHONE NO.', type: 'text', filterable: true },
  { field: 'email', headerName: 'EMAIL', type: 'text', editable: false, minWidth: 180, filterable: true },
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
  { field: 'dateJoined', headerName: 'JOINED DATE', type: 'date', editable: false },
  { field: 'actions', headerName: '', type: 'actions' }
];
