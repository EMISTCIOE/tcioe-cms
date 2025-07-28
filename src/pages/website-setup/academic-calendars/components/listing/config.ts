import { Theme } from '@mui/material/styles';
import { enumToOptions } from '@/utils/functions/formatString';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { IAcademicCalendarsItem, IProgramType } from '../../redux/types';

export interface ITableData extends Omit<IAcademicCalendarsItem, 'isActive'> {
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<ITableData>[] => [
  {
    field: 'programType',
    headerName: 'PROGRAM TYPE',
    type: 'select',
    valueOptions: [...enumToOptions(IProgramType)],
    filterable: true,
    minWidth: 200
  },
  { field: 'startYear', headerName: 'START YEAR', type: 'date', sortable: true, filterable: true },
  { field: 'endYear', headerName: 'END YEAR', type: 'date', sortable: true, filterable: true },
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
