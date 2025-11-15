import { CircularProgress } from '@mui/material';
import AppDialog from '@/components/app-dialog';
import { useDispatch, useSelector } from 'react-redux';
import { useRetrieveGlobalGalleryImageQuery } from '../../redux/globalGalleryImages.api';
import { globalGalleryImagesState } from '../../redux/globalGalleryImages.selector';
import { clearImageData, setEdit } from '../../redux/globalGalleryImages.slice';
import GlobalGalleryUpdateForm from './Form';

const GlobalGalleryEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(globalGalleryImagesState);

  const { data, isLoading } = useRetrieveGlobalGalleryImageQuery(currentId, {
    skip: !currentId || !edit
  });

  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearImageData());
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
          <GlobalGalleryUpdateForm imageData={data} onClose={handleClose} />
        )
      }
    />
  );
};

export default GlobalGalleryEditModal;
