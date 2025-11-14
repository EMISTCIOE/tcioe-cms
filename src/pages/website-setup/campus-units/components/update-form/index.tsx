// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveCampusUnitsQuery } from '../../redux/campusUnits.api';
import { campusUnitsState } from '../../redux/campusUnits.selector';
import { clearCampusUnitsData, setEdit } from '../../redux/campusUnits.slice';
import CampusUnitsUpdateForm from './Form';

const CampusUnitsEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(campusUnitsState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: campusUnitsData, isLoading } = useRetrieveCampusUnitsQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearCampusUnitsData());
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
          <CampusUnitsUpdateForm campusUnitsData={campusUnitsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusUnitsEditModal;
