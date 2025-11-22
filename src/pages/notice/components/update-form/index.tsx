// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveNoticeQuery } from '../../redux/notice.api';
import { noticeState } from '../../redux/notice.selector';
import { clearNoticeData, setEdit } from '../../redux/notice.slice';
import NoticeUpdateForm from './Form';

const NoticeEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(noticeState);

  // Convert currentId to number for the query
  const numericId = currentId ? Number(currentId) : null;

  // Only fetch when we have a valid ID and are in edit mode
  const { data: noticeData, isLoading } = useRetrieveNoticeQuery(numericId, { skip: !numericId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearNoticeData());
  };

  return (
    <AppDialog
      open={edit}
      onClose={handleClose}
      fullWidth={false}
      maxWidth="lg"
      title="Update Notice"
      content={
        isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <NoticeUpdateForm noticeData={noticeData} onClose={handleClose} />
        )
      }
    />
  );
};

export default NoticeEditModal;
