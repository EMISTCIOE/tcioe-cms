import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { INoticeDetails } from '../../redux/types';

export const viewNoticeConfig: Omit<DynamicInfoSectionProps<INoticeDetails>, 'data'> = {
  excludeFields: ['id', 'thumbnail', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'department', 'category', 'slug', 'description'],
  fieldOrder: [
    'title',
    'author.fullName',
    'department.name',
    'category.name',
    'isFeatured',
    'isApprovedByDepartment',
    'isApprovedByCampus',
    'isActive'
  ],
  booleanFields: ['isActive', 'isFeatured', 'isApprovedByDepartment', 'isApprovedByCampus'],
  columns: 4,
  customLabels: {
    title: 'Notice title',
    'author.fullName': 'Author',
    'department.name': 'Department',
    'category.name': 'Category',
    isFeatured: 'Featured Status',
    isApprovedByDepartment: 'Approved by Department',
    isApprovedByCampus: 'Approved by Campus',
    isActive: 'Active Status'
  }
};
