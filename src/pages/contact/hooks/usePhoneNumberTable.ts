import { useAppDispatch } from '@/libs/hooks';
import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useGetPhoneNumbersQuery, useDeletePhoneNumberMutation, useUpdatePhoneNumberMutation } from '../redux/contact.api';
import { ITableData } from '../components/listing/config';
import { IPhoneNumberList, IPhoneNumberUpdatePayload } from '../redux/types';
import { setSelectedPhoneNumberId, openEditModal } from '../redux/contact.slice';

/**
 * Custom hook for Phone Number table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the Phone Number table
 */
export const usePhoneNumberTable = () => {
  const dispatch = useAppDispatch();

  // Call the hook once
  const tableDataHook = createTableDataHook<ITableData, IPhoneNumberList, IPhoneNumberUpdatePayload>({
    useListQuery: useGetPhoneNumbersQuery,
    useUpdateMutation: useUpdatePhoneNumberMutation,
    useDeleteMutation: useDeletePhoneNumberMutation,

    setId: (id) => {
      dispatch(setSelectedPhoneNumberId(id));
    },

    setEdit: (value) => {
      if (value) {
        dispatch(openEditModal());
      }
    },

    // Data transformation from API response to table format
    transformResponseToTableData: (data: IPhoneNumberList) =>
      data?.results?.map((item) => ({
        ...item,
        description: item.description || '' // Convert optional to required with default empty string
      })) || [],

    // Transform table data to update input format
    transformTableDataToUpdateInput: (rowData: ITableData) => ({
      department_name: rowData.department_name,
      phone_number: rowData.phone_number,
      description: rowData.description,
      display_order: rowData.display_order,
      is_active: rowData.is_active
    })
  });

  return {
    tableDataHook
  };
};
