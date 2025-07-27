// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusDownloadsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const CampusDownloadsListing = lazy(() => import('./components/listing'));
const CampusDownloadsDetailsModal = lazy(() => import('./components/detail'));
const CampusDownloadsEditModal = lazy(() => import('./components/update-form'));

const CampusDownloads = () => {
  return (
    <>
      <CampusDownloadsListing />
      <CampusDownloadsEditModal />
      <CampusDownloadsDetailsModal />
    </>
  );
};

export default validatePermissions(CampusDownloads, campusDownloadsPermissions);
