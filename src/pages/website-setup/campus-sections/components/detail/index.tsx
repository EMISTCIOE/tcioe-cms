import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveCampusSectionsQuery } from '../../redux/campusSections.api';
import { campusSectionsState } from '../../redux/campusSections.selector';
import { clearViewId } from '../../redux/campusSections.slice';
import DetailView from './DetailView';

const CampusSectionsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(campusSectionsState);

  // Only fetch when we have a valid ID of campusSections
  const { data: campusSectionsData, isLoading } = useRetrieveCampusSectionsQuery(viewId, { skip: !viewId });

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
          <DetailView campusSectionsData={campusSectionsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusSectionsDetailsModal;
