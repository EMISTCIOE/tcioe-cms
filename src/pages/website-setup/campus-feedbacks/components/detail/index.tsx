import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveCampusFeedbacksQuery } from '../../redux/campusFeedbacks.api';
import { campusFeedbacksState } from '../../redux/campusFeedbacks.selector';
import { clearViewId } from '../../redux/campusFeedbacks.slice';
import DetailView from './DetailView';

const CampusFeedbacksDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(campusFeedbacksState);

  // Only fetch when we have a valid ID of campusFeedbacks
  const { data: campusFeedbacksData, isLoading } = useRetrieveCampusFeedbacksQuery(viewId, { skip: !viewId });

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
          <DetailView campusFeedbacksData={campusFeedbacksData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusFeedbacksDetailsModal;
