import { Theme } from '@mui/material/styles';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { IGlobalEvent } from '../../redux/globalEvents.types';
import { enumToOptions } from '@/utils/functions/formatString';
import { ICampusEvent } from '@/pages/website-setup/campus-events/redux/types';
import { Box, IconButton, Tooltip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export interface ITableData extends Omit<IGlobalEvent, 'isActive' | 'isApprovedByDepartment' | 'isApprovedByCampus'> {
  actions?: string;
  isActive: 'true' | 'false';
  isApprovedByDepartment?: 'true' | 'false';
  isApprovedByCampus?: 'true' | 'false';
}

const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

const IsApprovedColorMap: BadgeColorMap = {
  YES: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  NO: { backgroundColor: 'error.lighter', color: 'error.main' }
};

const ApprovalCell = ({
  approved,
  disabled,
  onApprove,
  onReject,
  label
}: {
  approved: boolean;
  disabled: boolean;
  onApprove: () => void;
  onReject: () => void;
  label: string;
}) =>
  approved ? (
    <Box
      component="span"
      sx={{
        px: 1,
        py: 0.5,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        borderRadius: 1,
        bgcolor: 'success.lighter',
        color: 'success.main',
        fontWeight: 600,
        fontSize: '0.875rem'
      }}
    >
      <CheckCircleOutlineIcon fontSize="small" /> Yes
    </Box>
  ) : (
    <Box display="flex" gap={0.5} alignItems="center">
      <Tooltip title={`Approve ${label}`}>
        <span>
          <IconButton
            size="small"
            color={approved ? 'success' : 'default'}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onApprove();
            }}
            sx={{ border: '1px solid', borderColor: approved ? 'success.light' : 'divider' }}
          >
            <CheckCircleOutlineIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={`Reject ${label}`}>
        <span>
          <IconButton
            size="small"
            color={!approved ? 'error' : 'default'}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReject();
            }}
            sx={{ border: '1px solid', borderColor: !approved ? 'error.light' : 'divider' }}
          >
            <CancelOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );

export const getColumnConfig = (
  theme: Theme,
  canEdit: boolean,
  canApproveDepartment: boolean,
  canApproveCampus: boolean,
  onApprovalChange?: (
    id: string,
    field: 'isApprovedByDepartment' | 'isApprovedByCampus',
    value: ITableData[keyof ITableData]
  ) => Promise<void>
): ColumnConfig<ITableData>[] => [
  { field: 'thumbnail', headerName: 'THUMBNAIL', type: 'image' },
  { field: 'title', headerName: 'TITLE', type: 'text' },
  {
    field: 'eventType',
    headerName: 'EVENT TYPE',
    type: 'select',
    valueOptions: [...enumToOptions(ICampusEvent)],
    filterable: true,
    minWidth: 220
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
  {
    field: 'isApprovedByDepartment',
    headerName: 'APPROVED (DEPT)',
    type: 'text',
    filterable: false,
    sortable: false,
    minWidth: 150,
    renderCell: (params) => (
      <ApprovalCell
        approved={params.row.isApprovedByDepartment === 'true'}
        disabled={!canApproveDepartment}
        onApprove={() => onApprovalChange && onApprovalChange(params.id as string, 'isApprovedByDepartment', true)}
        onReject={() => onApprovalChange && onApprovalChange(params.id as string, 'isApprovedByDepartment', false)}
        label="Department"
      />
    )
  },
  {
    field: 'isApprovedByCampus',
    headerName: 'APPROVED (CAMPUS)',
    type: 'text',
    filterable: false,
    sortable: false,
    minWidth: 160,
    renderCell: (params) => (
      <ApprovalCell
        approved={params.row.isApprovedByCampus === 'true'}
        disabled={!canApproveCampus}
        onApprove={() => onApprovalChange && onApprovalChange(params.id as string, 'isApprovedByCampus', true)}
        onReject={() => onApprovalChange && onApprovalChange(params.id as string, 'isApprovedByCampus', false)}
        label="Campus"
      />
    )
  },
  { field: 'actions', headerName: '', type: 'actions' }
];
