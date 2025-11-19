import { Theme } from '@mui/material';
import { ColumnConfig } from '@/components/app-table/columns';

export interface ITableData {
  id: string;
  department_name: string;
  phone_number: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getColumnConfig = (_theme: Theme): ColumnConfig<ITableData>[] => [
  { field: 'id', headerName: 'ID', type: 'number', editable: false, minWidth: 80, maxWidth: 100 },
  { field: 'department_name', headerName: 'Department/Section', type: 'text', minWidth: 220 },
  { field: 'phone_number', headerName: 'Phone Number', type: 'text', minWidth: 150 },
  { field: 'description', headerName: 'Description', type: 'text', minWidth: 220 },
  { field: 'display_order', headerName: 'Display Order', type: 'number', minWidth: 140 },
  {
    field: 'is_active',
    headerName: 'Active',
    type: 'boolean',
    minWidth: 120,
    trueLabel: 'Active',
    falseLabel: 'Inactive'
  },
  { field: 'created_at', headerName: 'Created At', type: 'date', editable: false, minWidth: 180 },
  { field: 'updated_at', headerName: 'Updated At', type: 'date', editable: false, minWidth: 180 }
];
