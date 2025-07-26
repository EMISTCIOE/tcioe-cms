import { Theme } from '@mui/material/styles';
import { enumToOptions } from '@/utils/functions/formatString';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { CampusKeyOfficialsDesignation, CampusKeyOfficialsTitleprefix, ICampusKeyOfficialsItem } from '../../redux/types';

export interface ITableData extends Omit<ICampusKeyOfficialsItem, 'middleName' | 'lastName' | 'isActive'> {
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<ITableData>[] => [
  { field: 'photo', headerName: 'PHOTO', type: 'image' },
  { field: 'titlePrefix', headerName: 'PREFIX', type: 'select', valueOptions: [...enumToOptions(CampusKeyOfficialsTitleprefix)] },
  {
    field: 'designation',
    headerName: 'DESIGNATION',
    type: 'select',
    valueOptions: [...enumToOptions(CampusKeyOfficialsDesignation)],
    filterable: true,
    minWidth: 240
  },
  { field: 'fullName', headerName: 'FULL NAME', type: 'text', sortable: true },
  { field: 'phoneNumber', headerName: 'PHONE NO.', type: 'text' },
  { field: 'email', headerName: 'EMAIL', type: 'text', minWidth: 180 },
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
