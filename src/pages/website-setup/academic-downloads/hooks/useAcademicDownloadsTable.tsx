import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { ITableData } from '../components/listing/config';
import {
  useDeleteAcademicDownloadsMutation,
  useGetAcademicDownloadsQuery,
  usePatchAcademicDownloadsMutation
} from '../redux/academicDownloads.api';
import { currentAcademicDownloadsId, setEdit, setViewId } from '../redux/academicDownloads.slice';
import { IAcademicDownloadsItem } from '../redux/types';

/**
 * Custom hook for AcademicDownloads table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the AcademicDownloads table
 */
export const useAcademicDownloadsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    // RTK Query hooks
    useListQuery: useGetAcademicDownloadsQuery,
    useUpdateMutation: usePatchAcademicDownloadsMutation,
    useDeleteMutation: useDeleteAcademicDownloadsMutation,

    // Set the id of the academicDownloads being edited
    setId: (id) => {
      dispatch(currentAcademicDownloadsId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the academicDownloads being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: IAcademicDownloadsItem) => ({
        ...item,
        departmentName: item?.department?.short_name || item?.department?.name || '-',
        isActive: (item as any)?.isActive || (item as any)?.is_active ? 'true' : 'false'
      }));
    },

    // NOTE - Data transformations table data to api data of inline update
    transformTableDataToUpdateInput: (rowData) => {
      const deptId = (rowData as any)?.department?.id;
      const active = (rowData as any)?.isActive === 'true' || (rowData as any)?.isActive === true;
      return {
        ...rowData,
        isActive: active,
        department: deptId ? String(deptId) : undefined
      };
    }
  });
};
