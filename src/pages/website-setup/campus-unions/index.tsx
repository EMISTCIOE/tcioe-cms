// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusUnionsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const CampusUnionsListing = lazy(() => import('./components/listing'));
const CampusUnionsDetailsModal = lazy(() => import('./components/detail'));
const CampusUnionsEditModal = lazy(() => import('./components/update-form'));

const CampusUnions = () => {
  return (
    <>
      <CampusUnionsListing />
      <CampusUnionsEditModal />
      <CampusUnionsDetailsModal />
    </>
  );
};

export default validatePermissions(CampusUnions, campusUnionsPermissions);
