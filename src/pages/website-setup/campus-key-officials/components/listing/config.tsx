import { Theme } from '@mui/material/styles';
import { enumToOptions } from '@/utils/functions/formatString';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { CampusKeyOfficialsTitleprefix, ICampusKeyOfficialsItem } from '../../redux/types';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { IconButton, Tooltip } from '@mui/material';

export interface ITableData extends Omit<ICampusKeyOfficialsItem, 'middleName' | 'lastName' | 'isActive' | 'isKeyOfficial'> {
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
  isKeyOfficial: 'true' | 'false';
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (theme: Theme, designationOptions: { label: string; value: string }[]): ColumnConfig<ITableData>[] => [
  { field: 'photo', headerName: 'PHOTO', type: 'image', width: 72 },
  {
    field: 'titlePrefix',
    headerName: 'PREFIX',
    type: 'select',
    width: 110,
    valueOptions: [...enumToOptions(CampusKeyOfficialsTitleprefix)]
  },
  {
    field: 'designation',
    headerName: 'DESIGNATION',
    type: 'select',
    valueOptions: designationOptions,
    filterable: true,
    minWidth: 180,
    flex: 1
  },
  { field: 'fullName', headerName: 'FULL NAME', type: 'text', sortable: true, minWidth: 160, flex: 1 },
  { field: 'phoneNumber', headerName: 'PHONE NO.', type: 'text', width: 130 },
  {
    field: 'email',
    headerName: 'EMAIL',
    type: 'text',
    minWidth: 120,
    flex: 0.6,
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
  {
    field: 'isKeyOfficial',
    headerName: 'KEY OFFICIAL',
    type: 'select',
    filterable: true,
    valueOptions: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ]
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
    colorMap: IsActiveColorMap,
    width: 140
  },
  { field: 'actions', headerName: '', type: 'actions', width: 90 }
];
