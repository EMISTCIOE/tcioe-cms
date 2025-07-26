// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusKeyOfficialsPermissions } from './constants/persmissions';
import { Typography } from '@mui/material';

const CampuskeyOfficials = () => {
  return (
    <>
      <Typography variant="h4">Campus key Officials</Typography>
      <Typography variant="body2">This page is under construction.</Typography>
    </>
  );
};

export default validatePermissions(CampuskeyOfficials, campusKeyOfficialsPermissions);
