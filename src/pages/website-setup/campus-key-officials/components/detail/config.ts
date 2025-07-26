import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusKeyOfficialsDetails } from '../../redux/types';

export const viewCampusKeyOfficialsConfig: Omit<DynamicInfoSectionProps<ICampusKeyOfficialsDetails>, 'data'> = {
  excludeFields: ['id', 'photo', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'message'],
  fieldOrder: ['designation', 'titlePrefix', 'fullName', 'email', 'phoneNumber', 'isActive'],
  booleanFields: ['isActive'],
  columns: 4,
  customLabels: {
    designation: 'Designation',
    titlePrefix: 'Title Prefix',
    fullName: 'Full Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    isActive: 'Active Status'
  }
};
