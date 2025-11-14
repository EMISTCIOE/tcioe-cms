// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useRetrieveResearchFacilityQuery } from '../../redux/researchFacilities.api';
import { researchFacilitiesState } from '../../redux/researchFacilities.selector';
import { clearResearchFacilitiesData, setEdit } from '../../redux/researchFacilities.slice';
import ResearchFacilitiesUpdateForm from './Form';

const ResearchFacilitiesEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(researchFacilitiesState);

  const { data: researchFacilityData, isLoading } = useRetrieveResearchFacilityQuery(currentId, {
    skip: !currentId || !edit
  });

  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearResearchFacilitiesData());
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
          <ResearchFacilitiesUpdateForm researchFacilityData={researchFacilityData} onClose={handleClose} />
        )
      }
    />
  );
};

export default ResearchFacilitiesEditModal;
