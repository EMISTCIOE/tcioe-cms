import { CircularProgress } from '@mui/material';
import AppDialog from '@/components/app-dialog';
import { useDispatch, useSelector } from 'react-redux';
import { useRetrieveGlobalGalleryCollectionQuery } from '../../redux/globalGalleryCollections.api';
import { globalGalleryCollectionsState } from '../../redux/globalGalleryCollections.selector';
import { clearGlobalGalleryCollectionsData, setEdit } from '../../redux/globalGalleryCollections.slice';
import GlobalGalleryUpdateForm from './Form';

const GlobalGalleryEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(globalGalleryCollectionsState);

  const { data, isLoading } = useRetrieveGlobalGalleryCollectionQuery(currentId, {
    skip: !currentId || !edit
  });

  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearGlobalGalleryCollectionsData());
  };

  return (
    <AppDialog
      open={edit}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      content={
        isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
            <CircularProgress />
          </div>
        ) : (
          <GlobalGalleryUpdateForm collectionData={data} onClose={handleClose} />
        )
      }
    />
  );
};

export default GlobalGalleryEditModal;
