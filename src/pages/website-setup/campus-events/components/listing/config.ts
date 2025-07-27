import { Theme } from '@mui/material/styles';
import { enumToOptions } from '@/utils/functions/formatString';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { ICampusEvent, ICampusEventsItem } from '../../redux/types';

export interface ITableData extends Omit<ICampusEventsItem, 'isActive'> {
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<ITableData>[] => [
  { field: 'thumbnail', headerName: 'THUMBNAIL', type: 'image' },
  { field: 'title', headerName: 'TITLE', type: 'text' },
  {
    field: 'eventType',
    headerName: 'EVENT TYPE',
    type: 'select',
    valueOptions: [...enumToOptions(ICampusEvent)],
    filterable: true,
    minWidth: 240
  },
  { field: 'eventStartDate', headerName: 'START DATE', type: 'date', sortable: true },
  { field: 'eventEndDate', headerName: 'END DATE', type: 'date', sortable: true },
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
