// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveAcademicDownloadsQuery } from '../../redux/academicDownloads.api';
import { academicDownloadsState } from '../../redux/academicDownloads.selector';
import { clearAcademicDownloadsData, setEdit } from '../../redux/academicDownloads.slice';
import AcademicDownloadsUpdateForm from './Form';

const AcademicDownloadsEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(academicDownloadsState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: academicDownloadsData, isLoading } = useRetrieveAcademicDownloadsQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearAcademicDownloadsData());
  };

  return (
    <AppDialog
      open={edit}
      onClose={handleClose}
      fullWidth
      content={
        isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <AcademicDownloadsUpdateForm academicDownloadsData={academicDownloadsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default AcademicDownloadsEditModal;
