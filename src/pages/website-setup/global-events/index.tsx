import { lazy } from 'react';
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { globalEventsPermissions } from './constants/permissions';

const GlobalEventsListing = lazy(() => import('./components/listing'));
const GlobalEventsEditModal = lazy(() => import('./components/update-form'));
const GlobalEventsDetailModal = lazy(() => import('./components/detail'));

const GlobalEventsPage = () => {
  return (
    <>
      <GlobalEventsListing />
      <GlobalEventsEditModal />
      <GlobalEventsDetailModal />
    </>
  );
};

export default validatePermissions(GlobalEventsPage, globalEventsPermissions);
