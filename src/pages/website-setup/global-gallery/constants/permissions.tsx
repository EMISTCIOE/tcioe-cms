import { IRequiredPermission } from '@/globals';

export const globalGalleryPermissions: IRequiredPermission = {
  view: ['view_galleryimage'],
  edit: 'change_galleryimage',
  add: 'add_galleryimage',
  delete: 'delete_galleryimage'
};
