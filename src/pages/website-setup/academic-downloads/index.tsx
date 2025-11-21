// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { academicDownloadsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const AcademicDownloadsListing = lazy(() => import('./components/listing'));
const AcademicDownloadsDetailsModal = lazy(() => import('./components/detail'));
const AcademicDownloadsEditModal = lazy(() => import('./components/update-form'));

const AcademicDownloads = () => {
  return (
    <>
      <AcademicDownloadsListing />
      <AcademicDownloadsEditModal />
      <AcademicDownloadsDetailsModal />
    </>
  );
};

export default validatePermissions(AcademicDownloads, academicDownloadsPermissions);
