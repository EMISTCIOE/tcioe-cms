import { IRequiredPermission } from '@/globals';

export const globalGalleryPermissions: IRequiredPermission = {
  view: ['view_gallerycollection'],
  edit: 'change_gallerycollection',
  add: 'add_gallerycollection',
  delete: 'delete_gallerycollection'
};
