import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/libs/hooks';
import { ITableData } from '../components/listing/config';
import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useDeleteNoticeMutation, useGetNoticesQuery, usePatchNoticeMutation } from '../redux/notice.api';
import { currentNoticeId, setEdit, setViewId } from '../redux/notice.slice';
import { INoticeCreatePayload, INoticeList } from '../redux/types';
import { useNoticeCategories } from './useNoticeCategories';
import { useNoticeDepartments } from './useNoticeDepartments';

/**
 * Custom hook for Notice table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the Notice table
 */
export const useNoticeTable = () => {
  const dispatch = useAppDispatch();
  const { noticeCategoriesOptions, isLoading: isLoadingCategories } = useNoticeCategories();
  const { noticeDepartmentsOptions, isLoading: isLoadingDepartments } = useNoticeDepartments();
  const [isOptionsLoaded, setIsOptionsLoaded] = useState(!isLoadingCategories && !isLoadingDepartments);

  useEffect(() => {
    if (!isLoadingCategories && !isLoadingDepartments) {
      setIsOptionsLoaded(true);
    }
  }, [isLoadingCategories, isLoadingDepartments]);

  // Call the hook once
  const tableDataHook = createTableDataHook<ITableData, INoticeList, INoticeCreatePayload>({
    useListQuery: useGetNoticesQuery,
    useUpdateMutation: usePatchNoticeMutation,
    useDeleteMutation: useDeleteNoticeMutation,

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
      return apiData.results.map((item) => ({
        ...item,
        isFeatured: item.isFeatured ? 'true' : 'false',
      })) as ITableData[];
    },
    transformTableDataToUpdateInput: (rowData) => {
      return rowData as unknown as INoticeCreatePayload;
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

  return { tableDataHook, isOptionsLoaded, noticeCategoriesOptions, noticeDepartmentsOptions };
};
