// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusKeyOfficialsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const CampusKeyOfficialsListing = lazy(() => import('./components/listing'));
const CampusKeyOfficialsDetailsModal = lazy(() => import('./components/detail'));
const CampusKeyOfficialsEditModal = lazy(() => import('./components/update-form'));

const CampusKeyOfficials = () => {
  return (
    <>
      <CampusKeyOfficialsListing />
      <CampusKeyOfficialsEditModal />
      <CampusKeyOfficialsDetailsModal />
    </>
  );
};

export default validatePermissions(CampusKeyOfficials, campusKeyOfficialsPermissions);
