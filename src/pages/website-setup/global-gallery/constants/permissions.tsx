import { IRequiredPermission } from '@/globals';

export const globalGalleryPermissions: IRequiredPermission = {
  view: ['view_campus_event', 'view_student_club_event', 'view_department_event'],
  edit: 'view_campus_event',
  add: 'view_campus_event',
  delete: 'view_campus_event'
};
