import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import { useDeleteCampusSectionsMutation, useGetCampusSectionsQuery, usePatchCampusSectionsMutation } from '../redux/campusSections.api';
import { currentCampusSectionsId, setEdit, setViewId } from '../redux/campusSections.slice';
import { ICampusSectionsItem } from '../redux/types';

/**
 * Custom hook for CampusSections table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the CampusSections table
 */
export const useCampusSectionsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetCampusSectionsQuery,
    useUpdateMutation: usePatchCampusSectionsMutation,
    useDeleteMutation: useDeleteCampusSectionsMutation,

    // Set the id of the campusSections being edited
    setId: (id) => {
      dispatch(currentCampusSectionsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the campusSections being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: ICampusSectionsItem) => ({
        ...item,
        isActive: item?.isActive ? 'true' : 'false'
      }));
    },

    // NOTE - Data transformations table data to api data of inline update
    transformTableDataToUpdateInput: (rowData) => {
      return rowData;
    }
  });
};
