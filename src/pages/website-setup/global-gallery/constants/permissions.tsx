import { IRequiredPermission } from '@/globals';

export const globalGalleryPermissions: IRequiredPermission = {
  view: ['view_globalgalleryimage'],
  edit: 'change_globalgalleryimage',
  add: 'add_globalgalleryimage',
  delete: 'delete_globalgalleryimage'
};
