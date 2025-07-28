import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { IAcademicCalendarsDetails } from '../../redux/types';

export const viewAcademicCalendarsConfig: Omit<DynamicInfoSectionProps<IAcademicCalendarsDetails>, 'data'> = {
  excludeFields: ['id', 'file', 'programType', 'createdAt', 'updatedAt'],
  fieldOrder: ['startYear', 'endYear', 'createdBy', 'updatedBy'],
  booleanFields: ['isActive'],
  columns: 4,
  customLabels: {
    startYear: 'Start Year',
    endYear: 'End Year',
    createdBy: 'Created By',
    updatedBy: 'Updated By'
  }
};
