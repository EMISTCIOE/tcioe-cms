// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveCampusKeyOfficialsQuery } from '../../redux/campusKeyOfficials.api';
import { campusKeyOfficialsState } from '../../redux/campusKeyOfficials.selector';
import { clearCampuskeyOfficialsData, setEdit } from '../../redux/campusKeyOfficials.slice';
import CampusKeyOfficialUpdateForm from './Form';

const CampusKeyOfficialEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(campusKeyOfficialsState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: campusKeyOfficialsData, isLoading } = useRetrieveCampusKeyOfficialsQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearCampuskeyOfficialsData());
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
          <CampusKeyOfficialUpdateForm campusKeyOfficialsData={campusKeyOfficialsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusKeyOfficialEditModal;
