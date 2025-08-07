// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusReportsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const CampusReportsListing = lazy(() => import('./components/listing'));
const CampusReportsDetailsModal = lazy(() => import('./components/detail'));
const CampusReportsEditModal = lazy(() => import('./components/update-form'));

const CampusReports = () => {
  return (
    <>
      <CampusReportsListing />
      <CampusReportsEditModal />
      <CampusReportsDetailsModal />
    </>
  );
};

export default validatePermissions(CampusReports, campusReportsPermissions);
