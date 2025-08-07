import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { IStudentClubsDetails } from '../../redux/types';

export const viewStudentClubsConfig: Omit<DynamicInfoSectionProps<IStudentClubsDetails>, 'data'> = {
  excludeFields: ['id', 'isActive', 'updatedAt', 'updatedBy', 'name', 'thumbnail', 'detailedDescription'],
  fieldOrder: ['websiteUrl', 'shortDescription', 'createdAt', 'createdBy'],
  dateTimeFields: ['createdAt'],
  columns: 4,
  customLabels: {
    websiteUrl: 'Website URL',
    shortDescription: 'Short Description',
    createdAt: 'Created At',
    createdBy: 'Created By'
  }
};
