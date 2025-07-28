// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { studentClubsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const StudentClubsListing = lazy(() => import('./components/listing'));
const StudentClubsDetailsModal = lazy(() => import('./components/detail'));
const StudentClubsEditModal = lazy(() => import('./components/update-form'));

const StudentClubs = () => {
  return (
    <>
      <StudentClubsListing />
      <StudentClubsEditModal />
      <StudentClubsDetailsModal />
    </>
  );
};

export default validatePermissions(StudentClubs, studentClubsPermissions);
