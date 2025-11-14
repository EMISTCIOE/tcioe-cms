import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useRetrieveResearchFacilityQuery } from '../../redux/researchFacilities.api';
import { researchFacilitiesState } from '../../redux/researchFacilities.selector';
import { clearViewId } from '../../redux/researchFacilities.slice';
import DetailView from './DetailView';

const ResearchFacilitiesDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(researchFacilitiesState);

  const { data: researchFacilityData, isLoading } = useRetrieveResearchFacilityQuery(viewId, { skip: !viewId });

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
          <DetailView researchFacilityData={researchFacilityData} onClose={handleClose} />
        )
      }
    />
  );
};

export default ResearchFacilitiesDetailsModal;
