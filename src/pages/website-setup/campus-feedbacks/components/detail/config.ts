import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusFeedbacksDetails } from '../../redux/types';

export const viewCampusFeedbacksConfig: Omit<DynamicInfoSectionProps<ICampusFeedbacksDetails>, 'data'> = {
  excludeFields: ['id', 'message', 'isResolved'],
  fieldOrder: ['fullName', 'rollNumber', 'email', 'createdAt'],
  dateTimeFields: ['createdAt'],
  columns: 4,
  customLabels: {
    fullName: 'Full Name',
    rollNumber: 'Roll Number',
    email: 'Email',
    isResolved: 'Resolved Status',
    createdAt: 'Created At'
  }
};
