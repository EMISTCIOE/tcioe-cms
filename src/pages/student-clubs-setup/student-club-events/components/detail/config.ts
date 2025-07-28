import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { IStudentClubEventsDetails } from '../../redux/types';

export const viewStudentClubEventsConfig: Omit<DynamicInfoSectionProps<IStudentClubEventsDetails>, 'data'> = {
  excludeFields: ['id', 'thumbnail', 'updatedAt', 'updatedBy', 'description'],
  fieldOrder: ['title', 'club.name', 'createdAt', 'createdBy'],
  dateTimeFields: ['date', 'createdAt'],
  columns: 4,
  customLabels: {
    title: 'Title',
    'club.name': 'Club',
    date: 'Event Date',
    createdAt: 'Created At',
    createdBy: 'Created By'
  }
};
