// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveNoticeQuery } from '../../redux/notice.api';
import { noticeState } from '../../redux/notice.selector';
import { clearViewId } from '../../redux/notice.slice';
import DetailView from './DetailView';

const NoticeDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(noticeState);

  // Only fetch when we have a valid ID of notice
  const { data: noticeData, isLoading } = useRetrieveNoticeQuery(viewId, { skip: !viewId });

  if (!viewId) {
    return null;
  }

  const handleClose = () => {
    dispatch(clearViewId());
  };

  return (
    <AppDialog
      open={!!viewId}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      content={
        isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <DetailView noticeData={noticeData} onClose={handleClose} />
        )
      }
    />
  );
};

export default NoticeDetailsModal;
