import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { Theme } from '@mui/material/styles';
import { UserItem } from '../../redux/types';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { IconButton, Tooltip } from '@mui/material';

export interface TableData extends Omit<UserItem, 'middleName' | 'lastName' | 'isActive'> {
  firstName: string;
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
  linkedEntity: string;
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
  {
    field: 'email',
    headerName: 'EMAIL',
    type: 'text',
    editable: false,
    minWidth: 120,
    filterable: false,
    renderCell: (params) =>
      params.row.email ? (
        <Tooltip title={params.row.email}>
          <IconButton size="small" component="a" href={`mailto:${params.row.email}`} onClick={(e) => e.stopPropagation()}>
            <MailOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        '—'
      )
  },
  { field: 'roleDisplay', headerName: 'ACCOUNT TYPE', type: 'text', editable: false, filterable: true, minWidth: 150 },
  {
    field: 'linkedEntity',
    headerName: 'LINKED TO',
    type: 'text',
    editable: false,
    sortable: false,
    minWidth: 200,
    renderCell: (params) => params.row.linkedEntity || '—'
  },
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
