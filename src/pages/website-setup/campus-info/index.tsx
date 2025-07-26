import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusInfoPermissions } from './constants/persmissions';
import { Typography } from '@mui/material';

const CampusInfo = () => {
  return (
    <>
      <Typography variant="h4">Campus Info</Typography>
      <Typography variant="body2">This page is under construction.</Typography>
    </>
  );
};

export default validatePermissions(CampusInfo, campusInfoPermissions);
