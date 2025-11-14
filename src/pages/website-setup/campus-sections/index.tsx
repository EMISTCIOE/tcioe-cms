// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusSectionsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const CampusSectionsListing = lazy(() => import('./components/listing'));
const CampusSectionsDetailsModal = lazy(() => import('./components/detail'));
const CampusSectionsEditModal = lazy(() => import('./components/update-form'));

const CampusSections = () => {
  return (
    <>
      <CampusSectionsListing />
      <CampusSectionsEditModal />
      <CampusSectionsDetailsModal />
    </>
  );
};

export default validatePermissions(CampusSections, campusSectionsPermissions);
