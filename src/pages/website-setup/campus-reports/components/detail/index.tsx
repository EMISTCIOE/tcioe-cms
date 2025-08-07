import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveCampusReportsQuery } from '../../redux/campusReports.api';
import { campusReportsState } from '../../redux/campusReports.selector';
import { clearViewId } from '../../redux/campusReports.slice';
import DetailView from './DetailView';

const CampusReportsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(campusReportsState);

  // Only fetch when we have a valid ID of campusReports
  const { data: campusReportsData, isLoading } = useRetrieveCampusReportsQuery(viewId, { skip: !viewId });

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
          <DetailView campusReportsData={campusReportsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusReportsDetailsModal;
