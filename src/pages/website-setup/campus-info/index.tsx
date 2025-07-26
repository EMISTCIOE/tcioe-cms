// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { campusInfoPermissions } from './constants/persmissions';
import { useGetCampusInfoQuery } from './redux/campusInfo.api';

// LAZY COMPONENT IMPORTS
const CampusInfoEditModal = lazy(() => import('./components/updateForm'));

const CampusInfo = () => {
  const { data } = useGetCampusInfoQuery();
  return (
    <>
      <CampusInfoEditModal campusInfoData={data} />
    </>
  );
};

export default validatePermissions(CampusInfo, campusInfoPermissions);
