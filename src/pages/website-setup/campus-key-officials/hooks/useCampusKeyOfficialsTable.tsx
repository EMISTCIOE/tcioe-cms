import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import {
  useDeleteCampusKeyOfficialsMutation,
  useGetCampusKeyOfficialsQuery,
  usePatchCampusKeyOfficialsMutation
} from '../redux/campusKeyOfficials.api';
import { currentCampuskeyOfficialsId, setEdit, setViewId } from '../redux/campusKeyOfficials.slice';
import { ICampusKeyOfficialsItem } from '../redux/types';

/**
 * Custom hook for CampusKeyOfficials table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the CampusKeyOfficials table
 */
export const useCampusKeyOfficialsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetCampusKeyOfficialsQuery,
    useUpdateMutation: usePatchCampusKeyOfficialsMutation,
    useDeleteMutation: useDeleteCampusKeyOfficialsMutation,

    // Set the id of the campusKeyOfficials being edited
    setId: (id) => {
      dispatch(currentCampuskeyOfficialsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the campusKeyOfficials being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: ICampusKeyOfficialsItem) => ({
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
