import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusDownloadsDetails } from '../../redux/types';

export const viewCampusDownloadsConfig: Omit<DynamicInfoSectionProps<ICampusDownloadsDetails>, 'data'> = {
  excludeFields: ['id', 'file', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
  fieldOrder: ['title', 'description', 'isActive'],
  booleanFields: ['isActive'],
  columns: 4,
  customLabels: {
    title: 'Title',
    description: 'Description',
    isActive: 'Active Status'
  }
};
