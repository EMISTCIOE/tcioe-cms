import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import type { ITableData } from '../components/listing/config';
import { useDeleteDepartmentMutation, useGetDepartmentsQuery, usePatchDepartmentMutation } from '../redux/departments.api';
import { currentDepartmentId, setEdit, setViewId } from '../redux/departments.slice';
import { IDepartment } from '../redux/types';

/**
 * Custom hook for Departments table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the Departments table
 */
export const useDepartmentsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetDepartmentsQuery,
    useUpdateMutation: usePatchDepartmentMutation,
    useDeleteMutation: useDeleteDepartmentMutation,

    // Set the id of the department being edited
    setId: (id) => {
      dispatch(currentDepartmentId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the department being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: IDepartment) => ({
        ...item,
        isActive: item?.is_active ? 'true' : 'false'
      }));
    },

    // NOTE - Data transformations table data to api data of inline update
    transformTableDataToUpdateInput: (rowData) => {
      return rowData;
    }
  });
};
