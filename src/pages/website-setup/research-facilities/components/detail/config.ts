import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { IResearchFacilityDetails } from '../../redux/types';

export const viewResearchFacilitiesConfig: Omit<DynamicInfoSectionProps<IResearchFacilityDetails>, 'data'> = {
  excludeFields: ['id', 'thumbnail', 'description', 'objectives'],
  fieldOrder: ['name', 'slug', 'displayOrder', 'shortDescription', 'isActive', 'createdAt', 'createdBy'],
  booleanFields: ['isActive'],
  dateTimeFields: ['createdAt'],
  columns: 2,
  customLabels: {
    name: 'Facility Name',
    slug: 'Slug',
    displayOrder: 'Display Order',
    shortDescription: 'Short Description',
    isActive: 'Active Status',
    createdAt: 'Created At',
    createdBy: 'Created By'
  }
};
