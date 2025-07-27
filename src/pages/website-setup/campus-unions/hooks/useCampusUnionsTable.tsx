import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import { useDeleteCampusUnionsMutation, useGetCampusUnionsQuery, usePatchCampusUnionsMutation } from '../redux/campusUnions.api';
import { currentCampusUnionsId, setEdit, setViewId } from '../redux/campusUnions.slice';
import { ICampusUnionsItem } from '../redux/types';

/**
 * Custom hook for CampusUnions table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the CampusUnions table
 */
export const useCampusUnionsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetCampusUnionsQuery,
    useUpdateMutation: usePatchCampusUnionsMutation,
    useDeleteMutation: useDeleteCampusUnionsMutation,

    // Set the id of the campusUnions being edited
    setId: (id) => {
      dispatch(currentCampusUnionsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the campusUnions being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: ICampusUnionsItem) => ({
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
