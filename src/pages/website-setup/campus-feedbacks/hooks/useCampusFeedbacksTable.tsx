import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import { useGetCampusFeedbacksQuery, useResolveCampusFeedbacksMutation } from '../redux/campusFeedbacks.api';
import { currentCampusFeedbacksId, setEdit, setViewId } from '../redux/campusFeedbacks.slice';
import { ICampusFeedbacksList, ICampusFeedbacksUpdatePayload } from '../redux/types';

/**
 * Custom hook for CampusFeedbacks table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the CampusFeedbacks table
 */
export const useCampusFeedbacksTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, ICampusFeedbacksList, ICampusFeedbacksUpdatePayload>({
    // RTK Query hooks
    useListQuery: useGetCampusFeedbacksQuery,
    useUpdateMutation: useResolveCampusFeedbacksMutation,
    useDeleteMutation: null,

    // Set the id of the campusFeedbacks being edited
    setId: (id) => {
      dispatch(currentCampusFeedbacksId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the campusFeedbacks being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData.results.map((item) => ({
        ...item,
        message: item?.message || '',
        isResolved: item?.isResolved ? 'true' : 'false'
      }));
    },

    // NOTE - Data transformations table data to api data of inline update
    transformTableDataToUpdateInput: (rowData) => {
      return { isResolved: rowData.isResolved === 'true' ? true : false };
    }
  });
};
