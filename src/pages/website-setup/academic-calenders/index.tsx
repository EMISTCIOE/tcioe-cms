// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { academicCalenderPermissions } from './constants/persmissions';
import { Typography } from '@mui/material';

const AcademicCalenders = () => {
  return (
    <>
      <Typography variant="h4">Academic Calenders</Typography>
      <Typography variant="body2">This page is under construction.</Typography>
    </>
  );
};

export default validatePermissions(AcademicCalenders, academicCalenderPermissions);
