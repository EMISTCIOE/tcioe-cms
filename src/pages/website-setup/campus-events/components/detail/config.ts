import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusEventsDetails } from '../../redux/types';

export const viewCampusEventsConfig: Omit<DynamicInfoSectionProps<ICampusEventsDetails>, 'data'> = {
  excludeFields: ['id', 'thumbnail', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'descriptionDetailed'],
  fieldOrder: ['title', 'union.name', 'eventStartDate', 'eventEndDate', 'eventType', 'descriptionShort', 'isActive', 'createdAt', 'createdBy'],
  booleanFields: ['isActive'],
  dateTimeFields: ['eventStartDate', 'eventEndDate', 'createdAt'],
  columns: 4,
  customLabels: {
    title: 'Title',
    'union.name': 'Union',
    eventStartDate: 'Event Start Date',
    eventEndDate: 'Event End Date',
    eventType: 'Event Type',
    descriptionShort: 'Short Description',
    isActive: 'Active Status',
    createdAt: 'Created At',
    createdBy: 'Created By'
  }
};
