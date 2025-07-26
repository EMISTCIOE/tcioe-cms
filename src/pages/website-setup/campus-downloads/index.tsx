// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusDownloadsPermissions } from './constants/persmissions';
import { Typography } from '@mui/material';

const CampusDownloads = () => {
  return (
    <>
      <Typography variant="h4">Campus Downloads</Typography>
      <Typography variant="body2">This page is under construction.</Typography>
    </>
  );
};

export default validatePermissions(CampusDownloads, campusDownloadsPermissions);
