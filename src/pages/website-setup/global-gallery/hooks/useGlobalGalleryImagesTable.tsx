import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';
import { useDeleteGlobalGalleryImageMutation, useGetGlobalGalleryImagesQuery } from '../redux/globalGalleryImages.api';
import { setCurrentImageId, setEdit, setViewId } from '../redux/globalGalleryImages.slice';
import { IGlobalGalleryImage, IGlobalGalleryImageList } from '../redux/globalGalleryImages.types';
import { IGlobalGalleryImageTableRow } from '../components/listing/config';

export const useGlobalGalleryImagesTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<IGlobalGalleryImageTableRow, IGlobalGalleryImageList>({
    useListQuery: useGetGlobalGalleryImagesQuery,
    useDeleteMutation: useDeleteGlobalGalleryImageMutation,
    transformResponseToTableData: (apiData) =>
      apiData?.results.map((item: IGlobalGalleryImage) => ({
        id: item.id,
        caption: item.caption || '',
        sourceType: item.sourceType,
        sourceName: item.sourceName,
        sourceContext: item.sourceContext || undefined,
        isActive: item.isActive,
        createdAt: item.createdAt
      })) ?? [],
    setId: (id) => {
      dispatch(setCurrentImageId(Number(id)));
    },
    setEdit: (value) => {
      dispatch(setEdit(value));
    },
    setViewId: (id) => {
      dispatch(setViewId(Number(id)));
    }
  });
};
