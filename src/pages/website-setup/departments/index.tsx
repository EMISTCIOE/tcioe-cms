// PACKAGE IMPORTS
import { lazy } from 'react';

// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { departmentsPermissions } from './constants/permissions';

// LAZY COMPONENT IMPORTS
const DepartmentsListing = lazy(() => import('./components/listing/index'));
const DepartmentDetailsModal = lazy(() => import('./components/detail/index'));
const DepartmentEditModal = lazy(() => import('./components/update-form/index'));

const Departments = () => {
  return (
    <>
      <DepartmentsListing />
      <DepartmentEditModal />
      <DepartmentDetailsModal />
    </>
  );
};

export default validatePermissions(Departments, departmentsPermissions);
