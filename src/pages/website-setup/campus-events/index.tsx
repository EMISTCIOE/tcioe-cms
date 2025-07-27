// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusEventsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const CampusEventsListing = lazy(() => import('./components/listing'));
const CampusEventsDetailsModal = lazy(() => import('./components/detail'));
const CampusEventsEditModal = lazy(() => import('./components/update-form'));

const CampusEvents = () => {
  return (
    <>
      <CampusEventsListing />
      <CampusEventsEditModal />
      <CampusEventsDetailsModal />
    </>
  );
};

export default validatePermissions(CampusEvents, campusEventsPermissions);
