import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import { useDeleteCampusEventsMutation, useGetCampusEventsQuery, usePatchCampusEventsMutation } from '../redux/campusEvents.api';
import { currentCampusEventsId, setEdit, setViewId } from '../redux/campusEvents.slice';
import { ICampusEventsItem } from '../redux/types';

/**
 * Custom hook for CampusEvents table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the CampusEvents table
 */
export const useCampusEventsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetCampusEventsQuery,
    useUpdateMutation: usePatchCampusEventsMutation,
    useDeleteMutation: useDeleteCampusEventsMutation,

    // Set the id of the campusEvents being edited
    setId: (id) => {
      dispatch(currentCampusEventsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the campusEvents being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: ICampusEventsItem) => ({
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
