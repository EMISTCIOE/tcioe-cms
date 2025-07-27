import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusUnionsDetails } from '../../redux/types';

export const viewCampusUnionsConfig: Omit<DynamicInfoSectionProps<ICampusUnionsDetails>, 'data'> = {
  excludeFields: ['id', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'description'],
  fieldOrder: ['name', 'isActive', 'createdAt', 'createdBy'],
  booleanFields: ['isActive'],
  dateTimeFields: ['createdAt'],
  columns: 4,
  customLabels: {
    name: 'Name',
    isActive: 'Active Status',
    createdAt: 'Created At',
    createdBy: 'Created By'
  }
};
