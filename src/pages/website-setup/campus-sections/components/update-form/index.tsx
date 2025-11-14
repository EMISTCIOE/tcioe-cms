// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveCampusSectionsQuery } from '../../redux/campusSections.api';
import { campusSectionsState } from '../../redux/campusSections.selector';
import { clearCampusSectionsData, setEdit } from '../../redux/campusSections.slice';
import CampusSectionsUpdateForm from './Form';

const CampusSectionsEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(campusSectionsState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: campusSectionsData, isLoading } = useRetrieveCampusSectionsQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearCampusSectionsData());
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
          <CampusSectionsUpdateForm campusSectionsData={campusSectionsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusSectionsEditModal;
