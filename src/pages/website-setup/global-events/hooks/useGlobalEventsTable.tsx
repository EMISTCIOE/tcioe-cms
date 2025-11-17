import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';

import { useDeleteGlobalEventsMutation, useGetGlobalEventsQuery, usePatchGlobalEventsMutation } from '../redux/globalEvents.api';
import { currentGlobalEventsId, setEdit, setViewId } from '../redux/globalEvents.slice';
import { ITableData } from '../components/listing/config';

export const useGlobalEventsTable = () => {
  const dispatch = useAppDispatch();

  return createTableDataHook<ITableData, any>({
    useListQuery: useGetGlobalEventsQuery,
    useUpdateMutation: usePatchGlobalEventsMutation,
    useDeleteMutation: useDeleteGlobalEventsMutation,

    setId: (id) => {
      dispatch(currentGlobalEventsId(id));
    },
    setEdit: (value) => {
      dispatch(setEdit(value));
    },
    setViewId: (id) => {
      dispatch(setViewId(id));
    },
    transformResponseToTableData: (apiData) =>
      apiData?.results?.map((item) => ({
        ...item,
        isActive: item?.isActive ? 'true' : 'false',
        isApprovedByDepartment: item?.isApprovedByDepartment ? 'true' : 'false',
        isApprovedByCampus: item?.isApprovedByCampus ? 'true' : 'false'
      })) ?? [],
    transformTableDataToUpdateInput: (rowData) => ({
      ...rowData,
      isActive: (rowData as any).isActive === 'true',
      isApprovedByDepartment: (rowData as any).isApprovedByDepartment === 'true',
      isApprovedByCampus: (rowData as any).isApprovedByCampus === 'true'
    })
  });
};
