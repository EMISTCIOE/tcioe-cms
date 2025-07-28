import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveStudentClubsQuery } from '../../redux/studentClubs.api';
import { studentClubsState } from '../../redux/studentClubs.selector';
import { clearViewId } from '../../redux/studentClubs.slice';
import DetailView from './DetailView';

const StudentClubsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(studentClubsState);

  // Only fetch when we have a valid ID of studentClubs
  const { data: studentClubsData, isLoading } = useRetrieveStudentClubsQuery(viewId, { skip: !viewId });

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
          <DetailView studentClubsData={studentClubsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default StudentClubsDetailsModal;
