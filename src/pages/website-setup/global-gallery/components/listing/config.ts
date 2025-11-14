import { ColumnConfig } from '@/components/app-table/columns';
import { Theme } from '@mui/material/styles';
import dayjs from 'dayjs';

export interface IGlobalGalleryTableRow {
  id: string;
  preview: string;
  caption: string;
  sourceType: string;
  sourceName: string;
  sourceContext?: string;
  createdAt: string;
}

const sourceTypeLabel: Record<string, string> = {
  campus_event: 'Campus Event',
  club_event: 'Student Club Event',
  department_event: 'Department Event'
};

export const getColumnConfig = (_theme: Theme): ColumnConfig<IGlobalGalleryTableRow>[] => [
  { field: 'preview', headerName: 'PHOTO', type: 'image', editable: false },
  { field: 'caption', headerName: 'CAPTION', type: 'text', minWidth: 300 },
  {
    field: 'sourceType',
    headerName: 'SOURCE',
    type: 'select',
    filterable: true,
    valueOptions: Object.entries(sourceTypeLabel).map(([value, label]) => ({ value, label })),
    renderCell: ({ row }) => sourceTypeLabel[row.sourceType] || row.sourceType
  },
  { field: 'sourceName', headerName: 'EVENT', type: 'text', minWidth: 200 },
  { field: 'sourceContext', headerName: 'CONTEXT', type: 'text', minWidth: 180 },
  {
    field: 'createdAt',
    headerName: 'ADDED ON',
    type: 'text',
    editable: false,
    renderCell: ({ value }) => dayjs(value as string).format('YYYY-MM-DD HH:mm')
  }
];
