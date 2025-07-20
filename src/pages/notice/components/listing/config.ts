import { Theme } from '@mui/material/styles';
import { INoticeItem, NoticeStatus } from '../../redux/types';
import { BadgeColorMap, ColumnConfig } from '@/components/app-table/columns';

export interface ITableData extends INoticeItem {
  actions?: string;
}

const StatusColorMap: BadgeColorMap = {
  DRAFT: { backgroundColor: 'secondary.lighter', color: 'secondary.main' },
  APPROVED: { backgroundColor: 'success.lighter', color: 'success.main' },
  REJECTED: { backgroundColor: 'error.lighter', color: 'error.main' },
  PENDING: { backgroundColor: 'warning.lighter', color: 'warning.main' }
};

export const getColumnConfig = (theme: Theme): ColumnConfig<ITableData>[] => [
  { field: 'thumbnail', headerName: 'THUMBNAIL', type: 'image', },
  { field: 'title', headerName: 'TITLE', type: 'text', minWidth: 200 },
  { field: 'departmentName', headerName: 'DEPARTMENT', type: 'text', editable: false, minWidth: 280, },
  { field: 'categoryName', headerName: 'CATEGORY', type: 'text', editable: false },
  { field: 'authorName', headerName: 'AUTHOR', type: 'text', editable: false },
  { field: 'publishedAt', headerName: 'PUBLISHED AT', type: 'date', sortable: true, editable: false },
  { field: 'isFeatured', headerName: 'FEATURED', type: 'boolean' },
  { field: 'status', headerName: 'STATUS', type: 'select', filterable: true, valueOptions: [...Object.values(NoticeStatus)], colorMap: StatusColorMap },
  { field: 'actions', headerName: '', type: 'actions' }
];
