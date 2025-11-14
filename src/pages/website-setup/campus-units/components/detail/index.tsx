import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveCampusUnitsQuery } from '../../redux/campusUnits.api';
import { campusUnitsState } from '../../redux/campusUnits.selector';
import { clearViewId } from '../../redux/campusUnits.slice';
import DetailView from './DetailView';

const CampusUnitsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(campusUnitsState);

  // Only fetch when we have a valid ID of campusUnits
  const { data: campusUnitsData, isLoading } = useRetrieveCampusUnitsQuery(viewId, { skip: !viewId });

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
          <DetailView campusUnitsData={campusUnitsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusUnitsDetailsModal;
