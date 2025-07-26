// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusReportsPermissions } from './constants/persmissions';
import { Typography } from '@mui/material';

const CampusReports = () => {
  return (
    <>
      <Typography variant="h4">Campus Reports</Typography>
      <Typography variant="body2">This page is under construction.</Typography>
    </>
  );
};

export default validatePermissions(CampusReports, campusReportsPermissions);
