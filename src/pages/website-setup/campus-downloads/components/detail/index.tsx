import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveCampusDownloadsQuery } from '../../redux/campusDownloads.api';
import { campusDownloadsState } from '../../redux/campusDownloads.selector';
import { clearViewId } from '../../redux/campusDownloads.slice';
import DetailView from './DetailView';

const CampusDownloadsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(campusDownloadsState);

  // Only fetch when we have a valid ID of campusDownloads
  const { data: campusDownloadsData, isLoading } = useRetrieveCampusDownloadsQuery(viewId, { skip: !viewId });

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
          <DetailView campusDownloadsData={campusDownloadsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusDownloadsDetailsModal;
