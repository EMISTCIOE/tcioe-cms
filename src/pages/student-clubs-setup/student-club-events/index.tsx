// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { studentClubEventsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const StudentClubEventsListing = lazy(() => import('./components/listing'));
const StudentClubEventsDetailsModal = lazy(() => import('./components/detail'));
const StudentClubEventsEditModal = lazy(() => import('./components/update-form'));

const StudentClubEvents = () => {
  return (
    <>
      <StudentClubEventsListing />
      <StudentClubEventsEditModal />
      <StudentClubEventsDetailsModal />
    </>
  );
};

export default validatePermissions(StudentClubEvents, studentClubEventsPermissions);
