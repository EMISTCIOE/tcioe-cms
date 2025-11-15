import { CircularProgress } from '@mui/material';
import AppDialog from '@/components/app-dialog';
import { useRetrieveGlobalGalleryImageQuery } from '../../redux/globalGalleryImages.api';
import { globalGalleryImagesState } from '../../redux/globalGalleryImages.selector';
import { useDispatch, useSelector } from 'react-redux';
import { clearViewId } from '../../redux/globalGalleryImages.slice';

const GlobalGalleryDetailModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(globalGalleryImagesState);

  const { data, isFetching } = useRetrieveGlobalGalleryImageQuery(viewId, {
    skip: !viewId
  });

  const handleClose = () => {
    dispatch(clearViewId());
  };

  if (!viewId) {
    return null;
  }

  return (
    <AppDialog
      open={Boolean(viewId)}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      content={
        isFetching ? (
          <div className="flex justify-center items-center p-6">
            <CircularProgress />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">{data?.sourceTitle || data?.sourceName || 'Gallery Image'}</h2>
              {data?.sourceContext && <p className="text-sm text-gray-600">{data.sourceContext}</p>}
              <p className="text-xs text-gray-500 mt-1">Created on {new Date(data?.createdAt || '').toLocaleString()}</p>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200">
              <img src={data?.image} alt={data?.caption || 'Gallery image'} className="w-full h-full object-cover" />
              {data?.caption && <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-xs text-white">{data.caption}</div>}
            </div>
          </div>
        )
      }
    />
  );
};

export default GlobalGalleryDetailModal;
