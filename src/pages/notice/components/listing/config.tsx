import { Theme } from '@mui/material/styles';
import { INoticeItem } from '../../redux/types';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { GridRowId, GridRowParams } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export interface ITableData extends Omit<INoticeItem, 'isFeatured' | 'isApprovedByDepartment' | 'isApprovedByCampus'> {
  actions?: string;
  isFeatured: 'true' | 'false'; // Convert boolean to string for select options
  isApprovedByDepartment?: 'true' | 'false';
  isApprovedByCampus?: 'true' | 'false';
}

const IsFeaturedColorMap: BadgeColorMap = {
  YES: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  NO: { backgroundColor: 'error.lighter', color: 'error.main' }
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
  _theme: Theme,
  categoryOptions: ColumnConfig<ITableData>['valueOptions'],
  departmentOptions: ColumnConfig<ITableData>['valueOptions'],
  canApproveDepartment: boolean,
  canApproveCampus: boolean,
  onApprovalChange: (id: GridRowId, field: 'isApprovedByDepartment' | 'isApprovedByCampus', value: boolean) => Promise<void>,
  customActions: ((params: GridRowParams<ITableData>) => JSX.Element)[]
): ColumnConfig<ITableData>[] => [
  { field: 'thumbnail', headerName: 'THUMBNAIL', type: 'image', minWidth: 80 },
  { field: 'title', headerName: 'TITLE', type: 'text', minWidth: 250 },
  {
    field: 'category',
    headerName: 'CATEGORY',
    type: 'select',
    editable: true,
    minWidth: 150,
    valueOptions: categoryOptions,
    filterable: true
  },
  {
    field: 'department',
    headerName: 'DEPARTMENT',
    type: 'select',
    editable: true,
    minWidth: 200,
    valueOptions: departmentOptions,
    filterable: true,
    visible: false
  },
  { field: 'authorName', headerName: 'AUTHOR', type: 'text', editable: false, minWidth: 150 },
  { field: 'publishedAt', headerName: 'PUBLISHED', type: 'date', sortable: true, editable: false, minWidth: 120 },
  {
    field: 'isFeatured',
    headerName: 'FEATURED',
    type: 'select',
    filterable: true,
    minWidth: 100,
    valueOptions: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    colorMap: IsFeaturedColorMap
  },
  {
    field: 'isApprovedByDepartment',
    headerName: 'DEPT',
    type: 'text',
    filterable: false,
    sortable: false,
    minWidth: 120,
    renderCell: (params) => (
      <ApprovalCell
        approved={params.row.isApprovedByDepartment === 'true'}
        disabled={!canApproveDepartment}
        onApprove={() => onApprovalChange(params.id, 'isApprovedByDepartment', true)}
        onReject={() => onApprovalChange(params.id, 'isApprovedByDepartment', false)}
        label="Department"
      />
    )
  },
  {
    field: 'isApprovedByCampus',
    headerName: 'CAMPUS',
    type: 'text',
    filterable: false,
    sortable: false,
    minWidth: 120,
    renderCell: (params) => (
      <ApprovalCell
        approved={params.row.isApprovedByCampus === 'true'}
        disabled={!canApproveCampus}
        onApprove={() => onApprovalChange(params.id, 'isApprovedByCampus', true)}
        onReject={() => onApprovalChange(params.id, 'isApprovedByCampus', false)}
        label="Campus"
      />
    )
  },
  {
    field: 'actions',
    headerName: 'ACTIONS',
    type: 'actions',
    minWidth: 120,
    customActions
  }
];
