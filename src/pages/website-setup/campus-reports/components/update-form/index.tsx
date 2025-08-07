// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveCampusReportsQuery } from '../../redux/campusReports.api';
import { campusReportsState } from '../../redux/campusReports.selector';
import { clearCampusReportsData, setEdit } from '../../redux/campusReports.slice';
import CampusKeyOfficialUpdateForm from './Form';

const CampusKeyOfficialEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(campusReportsState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: campusReportsData, isLoading } = useRetrieveCampusReportsQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearCampusReportsData());
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
          <CampusKeyOfficialUpdateForm campusReportsData={campusReportsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusKeyOfficialEditModal;
