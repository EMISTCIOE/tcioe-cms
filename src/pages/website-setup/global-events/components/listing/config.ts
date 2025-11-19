import { Theme } from '@mui/material/styles';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { IGlobalEvent } from '../../redux/globalEvents.types';
import { enumToOptions } from '@/utils/functions/formatString';
import { ICampusEvent } from '@/pages/website-setup/campus-events/redux/types';

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

export const getColumnConfig = (
  theme: Theme,
  canEdit: boolean,
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
    type: 'select',
    filterable: true,
    valueOptions: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    colorMap: IsApprovedColorMap,
    editable: canEdit,
    handleChange: (id, value) => onApprovalChange && onApprovalChange(id as string, 'isApprovedByDepartment', value)
  },
  {
    field: 'isApprovedByCampus',
    headerName: 'APPROVED (CAMPUS)',
    type: 'select',
    filterable: true,
    valueOptions: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    colorMap: IsApprovedColorMap,
    editable: canEdit,
    handleChange: (id, value) => onApprovalChange && onApprovalChange(id as string, 'isApprovedByCampus', value)
  },
  { field: 'actions', headerName: '', type: 'actions' }
];
