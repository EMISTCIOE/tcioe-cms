import { Theme } from '@mui/material/styles';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { IStudentClubEventsItem } from '../../redux/types';

export interface ITableData extends Omit<IStudentClubEventsItem, 'isActive'> {
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (
  theme: Theme,
  studentClubsOptions: ColumnConfig<ITableData>['valueOptions']
): ColumnConfig<ITableData>[] => [
  { field: 'thumbnail', headerName: 'THUMBNAIL', type: 'image' },
  { field: 'title', headerName: 'TITLE', type: 'text', sortable: true },
  { field: 'date', headerName: 'DATE', type: 'date', sortable: true, filterable: true },
  { field: 'club', headerName: 'CLUB', type: 'select', valueOptions: studentClubsOptions, filterable: true },
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
