import AppDialog from '@/components/app-dialog';
import { useRetrieveGlobalGalleryCollectionQuery } from '../../redux/globalGalleryCollections.api';
import { globalGalleryCollectionsState } from '../../redux/globalGalleryCollections.selector';
import { useDispatch, useSelector } from 'react-redux';
import { clearViewId } from '../../redux/globalGalleryCollections.slice';

const GlobalGalleryDetailModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(globalGalleryCollectionsState);

  const { data, isFetching } = useRetrieveGlobalGalleryCollectionQuery(viewId, {
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
      maxWidth="lg"
      content={
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">{data?.title || 'Gallery Collection'}</h2>
            {data?.description && <p className="text-sm text-gray-600">{data.description}</p>}
            <p className="text-xs text-gray-500 mt-1">Created on {new Date(data?.createdAt || '').toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data?.images.map((image) => (
              <div key={image.uuid} className="relative aspect-square overflow-hidden rounded-xl border border-gray-200">
                <img src={image.image} alt={image.caption || 'Gallery image'} className="w-full h-full object-cover" />
                {image.caption && <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-xs text-white">{image.caption}</div>}
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
};

export default GlobalGalleryDetailModal;
