import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';
import { useDeleteGlobalGalleryCollectionMutation, useGetGlobalGalleryCollectionsQuery } from '../redux/globalGalleryCollections.api';
import { currentGlobalGalleryCollectionsId, setEdit, setViewId } from '../redux/globalGalleryCollections.slice';
import { IGlobalGalleryCollection, IGlobalGalleryCollectionList } from '../redux/globalGalleryCollections.types';
import { IGlobalGalleryCollectionTableRow } from '../components/listing/config';

const deriveSource = (
  item: IGlobalGalleryCollection
): { type: string; name: string; context?: string } => {
  if (item.campusEvent) {
    return { type: 'campus_event', name: item.campusEvent.name, context: item.campusEvent.name };
  }
  if (item.studentClubEvent) {
    return { type: 'club_event', name: item.studentClubEvent.name, context: item.studentClubEvent.name };
  }
  if (item.departmentEvent) {
    return { type: 'department_event', name: item.departmentEvent.name, context: item.departmentEvent.name };
  }
  if (item.union) {
    return { type: 'union_gallery', name: item.union.name, context: item.title || 'Union Gallery' };
  }
  if (item.club) {
    return { type: 'club_gallery', name: item.club.name, context: item.title || 'Club Gallery' };
  }
  if (item.department) {
    return { type: 'department_gallery', name: item.department.name, context: item.title || 'Department Gallery' };
  }
  return { type: 'gallery_collection', name: item.title || 'Gallery Collection', context: item.description || '' };
};

export const useGlobalGalleryCollectionsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<IGlobalGalleryCollectionTableRow, IGlobalGalleryCollectionList>({
    useListQuery: useGetGlobalGalleryCollectionsQuery,
    useDeleteMutation: useDeleteGlobalGalleryCollectionMutation,
    transformResponseToTableData: (apiData) =>
      apiData?.results.map((item: IGlobalGalleryCollection) => {
        const source = deriveSource(item);
        return {
          id: item.id,
          title: item.title || 'Untitled',
          sourceType: source.type,
          sourceName: source.name,
          sourceContext: source.context,
          isActive: item.isActive,
          createdAt: item.createdAt
        };
      }) ?? [],
    setId: (id) => {
      dispatch(currentGlobalGalleryCollectionsId(Number(id)));
    },
    setEdit: (value) => {
      dispatch(setEdit(value));
    },
    setViewId: (id) => {
      dispatch(setViewId(Number(id)));
    }
  })();
};
