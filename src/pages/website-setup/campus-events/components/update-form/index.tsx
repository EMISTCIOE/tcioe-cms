// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveCampusEventsQuery } from '../../redux/campusEvents.api';
import { campusEventsState } from '../../redux/campusEvents.selector';
import { clearCampusEventsData, setEdit } from '../../redux/campusEvents.slice';
import CampusKeyOfficialUpdateForm from './Form';

const CampusKeyOfficialEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(campusEventsState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: campusEventsData, isLoading } = useRetrieveCampusEventsQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearCampusEventsData());
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
          <CampusKeyOfficialUpdateForm campusEventsData={campusEventsData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusKeyOfficialEditModal;
