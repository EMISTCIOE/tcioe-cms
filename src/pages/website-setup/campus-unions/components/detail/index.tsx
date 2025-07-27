import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveCampusUnionsQuery } from '../../redux/campusUnions.api';
import { campusUnionsState } from '../../redux/campusUnions.selector';
import { clearViewId } from '../../redux/campusUnions.slice';
import DetailView from './DetailView';

const CampusUnionsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(campusUnionsState);

  // Only fetch when we have a valid ID of campusUnions
  const { data: campusUnionsData, isLoading } = useRetrieveCampusUnionsQuery(viewId, { skip: !viewId });

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
          <DetailView campusUnionsData={campusUnionsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusUnionsDetailsModal;
