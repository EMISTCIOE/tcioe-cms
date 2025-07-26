// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveCampusFeedbacksQuery } from '../../redux/campusFeedbacks.api';
import { campusFeedbacksState } from '../../redux/campusFeedbacks.selector';
import { clearCampusFeedbacksData, setEdit } from '../../redux/campusFeedbacks.slice';
import CampusKeyOfficialUpdateForm from './Form';

const CampusKeyOfficialEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(campusFeedbacksState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: campusFeedbacksData, isLoading } = useRetrieveCampusFeedbacksQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearCampusFeedbacksData());
  };

  return (
    <AppDialog
      open={edit}
      onClose={handleClose}
      maxWidth="lg"
      content={
        isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <CampusKeyOfficialUpdateForm campusFeedbacksData={campusFeedbacksData} onClose={handleClose} />
        )
      }
    />
  );
};

export default CampusKeyOfficialEditModal;
