// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { academicCalendarsPermissions } from './constants/persmissions';

// LAZY COMPONENT IMPORTS
const AcademicCalendarsListing = lazy(() => import('./components/listing'));
const AcademicCalendarsDetailsModal = lazy(() => import('./components/detail'));
const AcademicCalendarsEditModal = lazy(() => import('./components/update-form'));

const AcademicCalendars = () => {
  return (
    <>
      <AcademicCalendarsListing />
      <AcademicCalendarsEditModal />
      <AcademicCalendarsDetailsModal />
    </>
  );
};

export default validatePermissions(AcademicCalendars, academicCalendarsPermissions);
