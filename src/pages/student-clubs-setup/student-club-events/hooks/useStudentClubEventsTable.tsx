import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import {
  useDeleteStudentClubEventsMutation,
  useGetStudentClubEventsQuery,
  usePatchStudentClubEventsMutation
} from '../redux/studentClubEvents.api';
import { currentStudentClubEventsId, setEdit, setViewId } from '../redux/studentClubEvents.slice';
import { IStudentClubEventsItem } from '../redux/types';
import { useStudentClubs } from './useStudentClubs';
import React, { useEffect, useState } from 'react';

/**
 * Custom hook for StudentClubEvents table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the StudentClubEvents table
 */
export const useStudentClubEventsTable = () => {
  const dispatch = useAppDispatch();
  const { studentClubsOptions, isLoading } = useStudentClubs();
  const [isOptionsLoaded, setIsOptionsLoaded] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      setIsOptionsLoaded(true);
    }
  }, [isLoading]);

  const tableDataHook = createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetStudentClubEventsQuery,
    useUpdateMutation: usePatchStudentClubEventsMutation,
    useDeleteMutation: useDeleteStudentClubEventsMutation,

    // Set the id of the studentClubEvents being edited
    setId: (id) => {
      dispatch(currentStudentClubEventsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the studentClubEvents being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: IStudentClubEventsItem) => ({
        ...item,
        club: item.club?.id || '',
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
  React.useEffect(() => {
    if (isOptionsLoaded) {
      refetch();
    }
  }, [isOptionsLoaded, refetch]);

  return { tableDataHook, isOptionsLoaded, studentClubsOptions };
};
