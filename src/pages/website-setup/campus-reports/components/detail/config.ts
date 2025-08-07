import { DynamicInfoSectionProps } from '@/components/detail-section/types';
import { ICampusReportsDetails } from '../../redux/types';

export const viewCampusReportsConfig: Omit<DynamicInfoSectionProps<ICampusReportsDetails>, 'data'> = {
  excludeFields: ['id', 'file', 'createdAt', 'updatedAt'],
  fieldOrder: ['reportType', 'fiscalSession.sessionFull', 'publishedDate', 'createdBy', 'updatedBy'],
  booleanFields: ['isActive'],
  columns: 4,
  customLabels: {
    reportType: 'Report Type',
    'fiscalSession.sessionFull': 'Fiscal Session',
    isActive: 'Is Active',
    publishedDate: 'Published Date',
    createdBy: 'Created By',
    updatedBy: 'Updated By'
  }
};
