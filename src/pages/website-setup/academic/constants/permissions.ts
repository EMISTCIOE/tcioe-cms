import { IRequiredPermission } from '@/globals';

export const academicModulePermissions: IRequiredPermission = {
  view: ['view_academic_program', 'view_subject'],
  add: ['add_academic_program', 'add_subject'],
  edit: ['edit_academic_program', 'edit_subject'],
  delete: ['delete_academic_program', 'delete_subject']
};
