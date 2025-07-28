import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusDownloadsDetails } from '../../redux/types';

export const viewCampusDownloadsConfig: Omit<DynamicInfoSectionProps<ICampusDownloadsDetails>, 'data'> = {
  excludeFields: ['id', 'file', 'isActive', 'title', 'description'],
  fieldOrder: ['createdAt', 'createdBy', 'updatedAt', 'updatedBy'],
  dateTimeFields: ['createdAt', 'updatedAt'],
  columns: 4,
  customLabels: {
    createdAt: 'Created At',
    createdBy: 'Created By',
    updatedAt: 'Updated At',
    updatedBy: 'Updated By'
  }
};
