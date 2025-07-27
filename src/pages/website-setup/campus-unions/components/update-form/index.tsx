// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveCampusUnionsQuery } from '../../redux/campusUnions.api';
import { campusUnionsState } from '../../redux/campusUnions.selector';
import { clearCampusUnionsData, setEdit } from '../../redux/campusUnions.slice';
import CampusKeyOfficialUpdateForm from './Form';

const CampusKeyOfficialEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(campusUnionsState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: campusUnionsData, isLoading } = useRetrieveCampusUnionsQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearCampusUnionsData());
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
          <CampusKeyOfficialUpdateForm campusUnionsData={campusUnionsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusKeyOfficialEditModal;
