// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusFeedbacksPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const CampusFeedbacksListing = lazy(() => import('./components/listing'));
const CampusFeedbacksDetailsModal = lazy(() => import('./components/detail'));
const CampusFeedbacksEditModal = lazy(() => import('./components/update-form'));

const CampusFeedbacks = () => {
  return (
    <>
      <CampusFeedbacksListing />
      <CampusFeedbacksEditModal />
      <CampusFeedbacksDetailsModal />
    </>
  );
};

export default validatePermissions(CampusFeedbacks, campusFeedbacksPermissions);
