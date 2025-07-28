import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import {
  useDeleteCampusDownloadsMutation,
  useGetCampusDownloadsQuery,
  usePatchCampusDownloadsMutation
} from '../redux/campusDownloads.api';
import { currentCampusdownloadsId, setEdit, setViewId } from '../redux/campusDownloads.slice';
import { ICampusDownloadsItem } from '../redux/types';

/**
 * Custom hook for CampusDownloads table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the CampusDownloads table
 */
export const useCampusDownloadsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetCampusDownloadsQuery,
    useUpdateMutation: usePatchCampusDownloadsMutation,
    useDeleteMutation: useDeleteCampusDownloadsMutation,

    // Set the id of the campusDownloads being edited
    setId: (id) => {
      dispatch(currentCampusdownloadsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the campusDownloads being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: ICampusDownloadsItem) => ({
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
