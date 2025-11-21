import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveAcademicDownloadsQuery } from '../../redux/academicDownloads.api';
import { academicDownloadsState } from '../../redux/academicDownloads.selector';
import { clearViewId } from '../../redux/academicDownloads.slice';
import DetailView from './DetailView';

const AcademicDownloadsDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(academicDownloadsState);

  // Only fetch when we have a valid ID of academicDownloads
  const { data: academicDownloadsData, isLoading } = useRetrieveAcademicDownloadsQuery(viewId, { skip: !viewId });

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
          <DetailView academicDownloadsData={academicDownloadsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default AcademicDownloadsDetailsModal;
