import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import { useDeleteCampusReportsMutation, useGetCampusReportsQuery, usePatchCampusReportsMutation } from '../redux/campusReports.api';
import { currentCampusReportsId, setEdit, setViewId } from '../redux/campusReports.slice';
import { ICampusReportsItem } from '../redux/types';
import { useFiscalSessions } from './useFiscalSessions';
import { useEffect, useState } from 'react';

/**
 * Custom hook for CampusReports table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the CampusReports table
 */
export const useCampusReportsTable = () => {
  const dispatch = useAppDispatch();
  const { fiscalSessionsOptions, isLoading } = useFiscalSessions();
  const [isOptionsLoaded, setIsOptionsLoaded] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      setIsOptionsLoaded(true);
    }
  }, [isLoading]);

  const tableDataHook = createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetCampusReportsQuery,
    useUpdateMutation: usePatchCampusReportsMutation,
    useDeleteMutation: useDeleteCampusReportsMutation,

    // Set the id of the campusReports being edited
    setId: (id) => {
      dispatch(currentCampusReportsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the campusReports being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: ICampusReportsItem) => ({
        ...item,
        fiscalSession: item.fiscalSession?.id || '',
        isActive: item?.isActive ? 'true' : 'false'
      }));
    },

    // NOTE - Data transformations table data to api data of inline update
    transformTableDataToUpdateInput: (rowData) => {
      return rowData;
    }
  });

  // Destructure refetch from the hook return
  const { refetch } = tableDataHook();

  // Refetch when options are loaded
  useEffect(() => {
    if (isOptionsLoaded) {
      refetch();
    }
  }, [isOptionsLoaded, refetch]);

  return { tableDataHook, isOptionsLoaded, fiscalSessionsOptions };
};
