import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusUnionsDetails } from '../../redux/types';

export const viewCampusUnionsConfig: Omit<DynamicInfoSectionProps<ICampusUnionsDetails>, 'data'> = {
  excludeFields: ['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
  fieldOrder: ['name', 'websiteUrl', 'shortDescription', 'isActive', 'createdAt', 'createdBy'],
  booleanFields: ['isActive'],
  dateTimeFields: ['createdAt'],
  columns: 4,
  customLabels: {
    name: 'Name',
    websiteUrl: 'Website URL',
    shortDescription: 'Short Description',
    isActive: 'Active Status',
    members: 'Members',
    createdAt: 'Created At',
    createdBy: 'Created By'
  }
};
