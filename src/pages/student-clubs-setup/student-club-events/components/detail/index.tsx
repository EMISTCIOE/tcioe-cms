import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveStudentClubEventsQuery } from '../../redux/studentClubEvents.api';
import { studentClubEventsState } from '../../redux/studentClubEvents.selector';
import { clearViewId } from '../../redux/studentClubEvents.slice';
import DetailView from './DetailView';

const StudentClubEventsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(studentClubEventsState);

  // Only fetch when we have a valid ID of studentClubEvents
  const { data: studentClubEventsData, isLoading } = useRetrieveStudentClubEventsQuery(viewId, { skip: !viewId });

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
          <DetailView studentClubEventsData={studentClubEventsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default StudentClubEventsDetailsModal;
