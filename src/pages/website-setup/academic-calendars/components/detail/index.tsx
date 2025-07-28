import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveAcademicCalendarsQuery } from '../../redux/academicCalendars.api';
import { academicCalendarsState } from '../../redux/academicCalendars.selector';
import { clearViewId } from '../../redux/academicCalendars.slice';
import DetailView from './DetailView';

const AcademicCalendarsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(academicCalendarsState);

  // Only fetch when we have a valid ID of academicCalendars
  const { data: academicCalendarsData, isLoading } = useRetrieveAcademicCalendarsQuery(viewId, { skip: !viewId });

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
          <DetailView academicCalendarsData={academicCalendarsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default AcademicCalendarsDetailsModal;
