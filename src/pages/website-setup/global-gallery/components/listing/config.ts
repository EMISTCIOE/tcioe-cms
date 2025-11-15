import { ColumnConfig } from '@/components/app-table/columns';
import { Theme } from '@mui/material/styles';
import dayjs from 'dayjs';

export interface IGlobalGalleryImageTableRow {
  id: number;
  caption: string;
  sourceType: string;
  sourceName: string;
  sourceContext?: string;
  isActive: boolean;
  createdAt: string;
  actions?: any;
}

export const sourceTypeLabels: Record<string, string> = {
  campus_event: 'Campus Event',
  union_event: 'Union Event',
  club_event: 'Student Club Event',
  department_event: 'Department Event',
  union_gallery: 'Union Gallery',
  club_gallery: 'Club Gallery',
  department_gallery: 'Department Gallery',
  global_event: 'Global Event',
  college: 'College Gallery',
  custom: 'Custom'
};

export const getColumnConfig = (_theme: Theme): ColumnConfig<IGlobalGalleryImageTableRow>[] => [
  { field: 'caption', headerName: 'CAPTION', type: 'text', minWidth: 220, editable: false },
  {
    field: 'sourceType',
    headerName: 'SOURCE',
    type: 'select',
    minWidth: 180,
    editable: false,
    valueOptions: Object.entries(sourceTypeLabels).map(([value, label]) => ({ value, label })),
    renderCell: ({ value }) => sourceTypeLabels[value] || value
  },
  { field: 'sourceName', headerName: 'SOURCE NAME', type: 'text', minWidth: 200, editable: false },
  {
    field: 'sourceContext',
    headerName: 'SOURCE CONTEXT',
    type: 'text',
    minWidth: 220,
    editable: false
  },
  {
    field: 'isActive',
    headerName: 'STATUS',
    type: 'boolean',
    minWidth: 120,
    editable: false,
    valueOptions: [
      { value: true, label: 'Active' },
      { value: false, label: 'Inactive' }
    ]
  },
  {
    field: 'createdAt',
    headerName: 'CREATED AT',
    type: 'date',
    minWidth: 180,
    editable: false,
    renderCell: ({ value }) => dayjs(value as string).format('YYYY-MM-DD HH:mm')
  },
  {
    field: 'actions',
    headerName: 'ACTIONS',
    type: 'actions',
    maxWidth: 120,
    editable: false
  }
];
