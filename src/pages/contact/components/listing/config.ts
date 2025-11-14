import { Theme } from '@mui/material';
import { GridColDef, GridValueGetter } from '@mui/x-data-grid';
import { IPhoneNumber } from '../../redux/types';

export interface ITableData {
  id: number;
  department_name: string;
  phone_number: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getColumnConfig = (theme: Theme): GridColDef[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 70,
    type: 'number'
  },
  {
    field: 'department_name',
    headerName: 'Department/Section',
    width: 250,
    editable: true
  },
  {
    field: 'phone_number',
    headerName: 'Phone Number',
    width: 150,
    editable: true
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 250,
    editable: true
  },
  {
    field: 'display_order',
    headerName: 'Display Order',
    width: 120,
    type: 'number',
    editable: true
  },
  {
    field: 'is_active',
    headerName: 'Active',
    width: 100,
    type: 'boolean',
    editable: true
  },
  {
    field: 'created_at',
    headerName: 'Created At',
    width: 150,
    type: 'dateTime',
    valueGetter: (params: any) => {
      return params.value ? new Date(params.value) : null;
    }
  },
  {
    field: 'updated_at',
    headerName: 'Updated At',
    width: 150,
    type: 'dateTime',
    valueGetter: (params: any) => {
      return params.value ? new Date(params.value) : null;
    }
  }
];
