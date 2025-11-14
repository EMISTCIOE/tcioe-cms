// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { researchFacilitiesPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const ResearchFacilitiesListing = lazy(() => import('./components/listing'));
const ResearchFacilitiesDetailsModal = lazy(() => import('./components/detail'));
const ResearchFacilitiesEditModal = lazy(() => import('./components/update-form'));

const ResearchFacilities = () => {
  return (
    <>
      <ResearchFacilitiesListing />
      <ResearchFacilitiesEditModal />
      <ResearchFacilitiesDetailsModal />
    </>
  );
};

export default validatePermissions(ResearchFacilities, researchFacilitiesPermissions);
