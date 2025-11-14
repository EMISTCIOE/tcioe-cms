import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusKeyOfficialsDetails } from '../../redux/types';

export const viewCampusKeyOfficialsConfig: Omit<DynamicInfoSectionProps<ICampusKeyOfficialsDetails>, 'data'> = {
  excludeFields: ['id', 'photo', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'message', 'designation'],
  fieldOrder: ['designationDisplay', 'titlePrefix', 'fullName', 'email', 'phoneNumber', 'isKeyOfficial', 'isActive'],
  booleanFields: ['isKeyOfficial', 'isActive'],
  columns: 4,
  customLabels: {
    designationDisplay: 'Designation',
    titlePrefix: 'Title Prefix',
    fullName: 'Full Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    isKeyOfficial: 'Key Official',
    isActive: 'Active Status'
  }
};
