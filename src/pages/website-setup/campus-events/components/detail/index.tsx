import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveCampusEventsQuery } from '../../redux/campusEvents.api';
import { campusEventsState } from '../../redux/campusEvents.selector';
import { clearViewId } from '../../redux/campusEvents.slice';
import DetailView from './DetailView';

const CampusEventsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(campusEventsState);

  // Only fetch when we have a valid ID of campusEvents
  const { data: campusEventsData, isLoading } = useRetrieveCampusEventsQuery(viewId, { skip: !viewId });

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
          <DetailView campusEventsData={campusEventsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusEventsDetailsModal;
