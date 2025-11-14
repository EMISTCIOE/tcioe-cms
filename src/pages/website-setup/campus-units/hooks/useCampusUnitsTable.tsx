import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import { useDeleteCampusUnitsMutation, useGetCampusUnitsQuery, usePatchCampusUnitsMutation } from '../redux/campusUnits.api';
import { currentCampusUnitsId, setEdit, setViewId } from '../redux/campusUnits.slice';
import { ICampusUnitsItem } from '../redux/types';

/**
 * Custom hook for CampusUnits table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the CampusUnits table
 */
export const useCampusUnitsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetCampusUnitsQuery,
    useUpdateMutation: usePatchCampusUnitsMutation,
    useDeleteMutation: useDeleteCampusUnitsMutation,

    // Set the id of the campusUnits being edited
    setId: (id) => {
      dispatch(currentCampusUnitsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the campusUnits being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: ICampusUnitsItem) => ({
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
