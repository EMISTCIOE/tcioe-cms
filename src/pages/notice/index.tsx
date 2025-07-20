// PROJECT IMPORTS
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { noticePermissions } from './constants/permissions';
import { lazy } from 'react';

// LAZY COMPONENT IMPORTS
const NoticeListing = lazy(() => import('./components/listing'));
const NoticeEditModal = lazy(() => import('./components/update-form'));
const NoticeDetailModal = lazy(() => import('./components/detail'));

const Notice = () => {
  return (
    <>
      <NoticeListing />
      <NoticeEditModal />
      <NoticeDetailModal />
    </>
  );
};

export default validatePermissions(Notice, noticePermissions);
