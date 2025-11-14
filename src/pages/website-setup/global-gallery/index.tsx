import { lazy } from 'react';
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { globalGalleryPermissions } from './constants/permissions';

const GlobalGalleryListing = lazy(() => import('./components/listing'));

const GlobalGalleryPage = () => {
  return <GlobalGalleryListing />;
};

export default validatePermissions(GlobalGalleryPage, globalGalleryPermissions);
