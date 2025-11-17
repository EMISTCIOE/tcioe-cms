import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { IDepartment } from '../../redux/types';

export const viewDepartmentConfig: Omit<DynamicInfoSectionProps<IDepartment>, 'data'> = {
  excludeFields: ['id', 'thumbnail', 'detailed_description'],
  fieldOrder: ['name', 'short_name', 'slug', 'email', 'phone_no', 'brief_description', 'is_active'],
  booleanFields: ['is_active'],
  dateTimeFields: [],
  columns: 4,
  customLabels: {
    name: 'Department Name',
    short_name: 'Short Name',
    slug: 'Slug',
    email: 'Email',
    phone_no: 'Phone Number',
    brief_description: 'Brief Description',
    is_active: 'Active Status'
  }
};
