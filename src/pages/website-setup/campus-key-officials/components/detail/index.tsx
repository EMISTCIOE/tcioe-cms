import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveCampusKeyOfficialsQuery } from '../../redux/campusKeyOfficials.api';
import { campusKeyOfficialsState } from '../../redux/campusKeyOfficials.selector';
import { clearViewId } from '../../redux/campusKeyOfficials.slice';
import DetailView from './DetailView';

const CampusKeyOfficialsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(campusKeyOfficialsState);

  // Only fetch when we have a valid ID of campusKeyOfficials
  const { data: campusKeyOfficialsData, isLoading } = useRetrieveCampusKeyOfficialsQuery(viewId, { skip: !viewId });

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
          <DetailView campusKeyOfficialsData={campusKeyOfficialsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusKeyOfficialsDetailsModal;
