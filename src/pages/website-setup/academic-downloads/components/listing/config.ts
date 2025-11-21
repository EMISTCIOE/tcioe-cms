import { Theme } from '@mui/material/styles';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { IAcademicDownloadsItem } from '../../redux/types';

export interface ITableData extends Omit<IAcademicDownloadsItem, 'isActive' | 'department'> {
  departmentName: string;
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<ITableData>[] => [
  { field: 'title', headerName: 'TITLE', type: 'text', sortable: true },
  { field: 'departmentName', headerName: 'DEPARTMENT', type: 'text', minWidth: 160 },
  { field: 'description', headerName: 'DESCRIPTION', type: 'richText', minWidth: 200 },
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
