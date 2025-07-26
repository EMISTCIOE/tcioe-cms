// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusFeedbacksPermissions } from './constants/persmissions';
import { Typography } from '@mui/material';

const CampusFeedbacks = () => {
  return (
    <>
      <Typography variant="h4">Campus Feedbacks</Typography>
      <Typography variant="body2">This page is under construction.</Typography>
    </>
  );
};

export default validatePermissions(CampusFeedbacks, campusFeedbacksPermissions);
