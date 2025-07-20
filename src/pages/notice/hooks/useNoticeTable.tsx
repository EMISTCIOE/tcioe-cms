import React from 'react';
import { useAppDispatch } from '@/libs/hooks';
import { ITableData } from '../components/listing/config';
import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useGetNoticesQuery, usePatchNoticeMutation } from '../redux/notice.api';
import { currentNoticeId, setEdit, setViewId } from '../redux/notice.slice';
import { INoticeCreatePayload, INoticeList } from '../redux/types';

/**
 * Custom hook for Notice table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the Notice table
 */
export const useNoticeTable = () => {
  const dispatch = useAppDispatch();

  // Call the hook once
  const tableDataHook = createTableDataHook<ITableData, INoticeList, INoticeCreatePayload>({
    useListQuery: useGetNoticesQuery,
    useUpdateMutation: usePatchNoticeMutation,
    useDeleteMutation: undefined,

    setId: (id) => {
      dispatch(currentNoticeId(id));
    },
    setEdit: (value) => {
      dispatch(setEdit(value));
    },
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    transformResponseToTableData: (apiData) => {
      return apiData.results
    },

    transformTableDataToUpdateInput: (rowData) => {
      return rowData as unknown as INoticeCreatePayload;
    }
  });

  return tableDataHook;
};
