import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/libs/hooks';
import { ITableData } from '../components/listing/config.tsx';
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
        isApprovedByDepartment: item.isApprovedByDepartment ? 'true' : 'false',
        isApprovedByCampus: item.isApprovedByCampus ? 'true' : 'false'
      })) as ITableData[];
    },
    transformTableDataToUpdateInput: (rowData) => {
      // Map the table row back to the API patch payload
      const mapped: any = {
        title: (rowData as any).title,
        department: (rowData as any).department,
        category: (rowData as any).category,
        thumbnail: (rowData as any).thumbnail,
        isFeatured: (rowData as any).isFeatured === 'true',
        description: (rowData as any).description
      };

      if ((rowData as any).isApprovedByDepartment !== undefined) {
        mapped.isApprovedByDepartment = (rowData as any).isApprovedByDepartment === 'true';
      }

      if ((rowData as any).isApprovedByCampus !== undefined) {
        mapped.isApprovedByCampus = (rowData as any).isApprovedByCampus === 'true';
      }

      return mapped as INoticeCreatePayload;
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
