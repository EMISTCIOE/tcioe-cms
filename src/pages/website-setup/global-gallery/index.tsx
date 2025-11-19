import { lazy } from 'react';
import { validateGlobalGalleryPermissions } from '@/utils/permissions/validatePermissions';
import { globalGalleryPermissions } from './constants/permissions';

const GlobalGalleryListing = lazy(() => import('./components/listing'));
const GlobalGalleryEditModal = lazy(() => import('./components/update-form'));
const GlobalGalleryDetailModal = lazy(() => import('./components/detail'));

const GlobalGalleryPage = () => {
  return (
    <>
      <GlobalGalleryListing />
      <GlobalGalleryEditModal />
      <GlobalGalleryDetailModal />
    </>
  );
};

export default validateGlobalGalleryPermissions(GlobalGalleryPage, globalGalleryPermissions);
