// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusUnitsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const CampusUnitsListing = lazy(() => import('./components/listing'));
const CampusUnitsDetailsModal = lazy(() => import('./components/detail'));
const CampusUnitsEditModal = lazy(() => import('./components/update-form'));

const CampusUnits = () => {
  return (
    <>
      <CampusUnitsListing />
      <CampusUnitsEditModal />
      <CampusUnitsDetailsModal />
    </>
  );
};

export default validatePermissions(CampusUnits, campusUnitsPermissions);
