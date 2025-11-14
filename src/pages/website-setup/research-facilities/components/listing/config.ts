import { Theme } from '@mui/material/styles';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { IResearchFacilityItem } from '../../redux/types';

export interface ITableData extends Omit<IResearchFacilityItem, 'isActive'> {
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
  { field: 'slug', headerName: 'SLUG', type: 'text', minWidth: 160 },
  { field: 'displayOrder', headerName: 'ORDER', type: 'number', sortable: true, minWidth: 100 },
  { field: 'shortDescription', headerName: 'SHORT DESCRIPTION', type: 'text', minWidth: 420 },
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
