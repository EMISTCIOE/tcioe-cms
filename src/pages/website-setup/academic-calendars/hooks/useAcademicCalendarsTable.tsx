import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import {
  useDeleteAcademicCalendarsMutation,
  useGetAcademicCalendarsQuery,
  usePatchAcademicCalendarsMutation
} from '../redux/academicCalendars.api';
import { currentAcademicCalendarsId, setEdit, setViewId } from '../redux/academicCalendars.slice';
import { IAcademicCalendarsItem } from '../redux/types';

/**
 * Custom hook for AcademicCalendars table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the AcademicCalendars table
 */
export const useAcademicCalendarsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetAcademicCalendarsQuery,
    useUpdateMutation: usePatchAcademicCalendarsMutation,
    useDeleteMutation: useDeleteAcademicCalendarsMutation,

    // Set the id of the academicCalendars being edited
    setId: (id) => {
      dispatch(currentAcademicCalendarsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the academicCalendars being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: IAcademicCalendarsItem) => ({
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
