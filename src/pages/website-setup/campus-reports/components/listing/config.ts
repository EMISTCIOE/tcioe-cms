import { Theme } from '@mui/material/styles';
import { enumToOptions } from '@/utils/functions/formatString';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';
import { ICampusReportsItem, IReportType } from '../../redux/types';

export interface ITableData extends Omit<ICampusReportsItem, 'isActive'> {
  actions?: string;
  isActive: 'true' | 'false'; // Convert boolean to string for select options,
}
const IsActiveColorMap: BadgeColorMap = {
  ACTIVE: { backgroundColor: 'primary.lighter', color: 'primary.main' },
  INACTIVE: { backgroundColor: 'error.lighter', color: 'error.main' }
};

export const getColumnConfig = (
  theme: Theme,
  fiscalSessionsOptions: ColumnConfig<ITableData>['valueOptions']
): ColumnConfig<ITableData>[] => [
  {
    field: 'reportType',
    headerName: 'REPORT TYPE',
    type: 'select',
    valueOptions: [...enumToOptions(IReportType)],
    filterable: true,
    minWidth: 200
  },
  {
    field: 'fiscalSession',
    headerName: 'FISCAL SESSION',
    type: 'select',
    valueOptions: fiscalSessionsOptions,
    filterable: true,
    minWidth: 200
  },
  { field: 'publishedDate', headerName: 'PUBLISHED YEAR', type: 'date', sortable: true },
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
