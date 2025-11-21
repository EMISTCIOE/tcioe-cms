import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { IAcademicDownloadsDetails } from '../../redux/types';

export const viewAcademicDownloadsConfig: Omit<DynamicInfoSectionProps<IAcademicDownloadsDetails>, 'data'> = {
  excludeFields: ['id', 'file', 'isActive', 'title', 'description', 'department'],
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
