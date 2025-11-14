import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import {
  useDeleteResearchFacilitiesMutation,
  useGetResearchFacilitiesQuery,
  usePatchResearchFacilitiesMutation
} from '../redux/researchFacilities.api';
import { currentResearchFacilitiesId, setEdit, setViewId } from '../redux/researchFacilities.slice';
import { IResearchFacilityItem } from '../redux/types';

/**
 * Custom hook for Research Facilities table.
 */
export const useResearchFacilitiesTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    useListQuery: useGetResearchFacilitiesQuery,
    useUpdateMutation: usePatchResearchFacilitiesMutation,
    useDeleteMutation: useDeleteResearchFacilitiesMutation,
    setId: (id) => {
      dispatch(currentResearchFacilitiesId(id));
    },
    setEdit: (value) => {
      dispatch(setEdit(value));
    },
    setViewId: (id) => {
      dispatch(setViewId(id));
    },
    transformResponseToTableData: (apiData) =>
      apiData?.results.map((item: IResearchFacilityItem) => ({
        ...item,
        isActive: item?.isActive ? 'true' : 'false'
      })),
    transformTableDataToUpdateInput: (rowData) => rowData
  });
};
