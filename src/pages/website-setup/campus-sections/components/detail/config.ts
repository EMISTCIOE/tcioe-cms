import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusSectionsDetails } from '../../redux/types';

export const viewCampusSectionsConfig: Omit<DynamicInfoSectionProps<ICampusSectionsDetails>, 'data'> = {
  excludeFields: [
    'id',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'thumbnail',
    'heroImage',
    'detailedDescription',
    'objectives',
    'achievements',
    'members',
    'departmentHead',
    'departmentHeadDetail',
    'officials'
  ],
  fieldOrder: [
    'name',
    'slug',
    'displayOrder',
    'location',
    'contactEmail',
    'contactPhone',
    'shortDescription',
    'designations',
    'isActive',
    'createdAt',
    'createdBy'
  ],
  booleanFields: ['isActive'],
  dateTimeFields: ['createdAt'],
  columns: 4,
  customLabels: {
    name: 'Section Name',
    slug: 'Slug',
    displayOrder: 'Display Order',
    location: 'Location',
    contactEmail: 'Contact Email',
    contactPhone: 'Contact Phone',
    shortDescription: 'Short Description',
    designations: 'Linked Designations',
    isActive: 'Active Status',
    createdAt: 'Created At',
    createdBy: 'Created By'
  }
};
