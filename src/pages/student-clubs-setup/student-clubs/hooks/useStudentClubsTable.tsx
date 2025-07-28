import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import { useDeleteStudentClubsMutation, useGetStudentClubsQuery, usePatchStudentClubsMutation } from '../redux/studentClubs.api';
import { currentStudentClubsId, setEdit, setViewId } from '../redux/studentClubs.slice';
import { IStudentClubsItem } from '../redux/types';

/**
 * Custom hook for StudentClubs table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the StudentClubs table
 */
export const useStudentClubsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetStudentClubsQuery,
    useUpdateMutation: usePatchStudentClubsMutation,
    useDeleteMutation: useDeleteStudentClubsMutation,

    // Set the id of the studentClubs being edited
    setId: (id) => {
      dispatch(currentStudentClubsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the studentClubs being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: IStudentClubsItem) => ({
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
