import { createTableDataHook } from '@/hooks/createTableDataHook';
import { useAppDispatch } from '@/libs/hooks';
import { combineName, splitName } from '@/utils/functions/splitCombineName';

import { TableData } from '../components/listing/config';
import { UserItem } from '../redux/types';

interface UseUserTableOptions {
  filters?: Record<string, string | number | boolean | undefined>;
}
import { useArchiveUserMutation, useGetUsersQuery, usePatchUserMutation } from '../redux/user.api';
import { currentUserId, setEdit, setViewId } from '../redux/user.slice';

/**
 * Custom hook for User table Fetching and updating
 *
 * Handles Table data fetching and inline updating through API's and data transformations for the User table
 */
const getLinkedEntityLabel = (user: UserItem) => {
  switch (user.role) {
    case 'EMIS-STAFF':
    case 'ADMIN':
      return user.designationTitle ? `Designation: ${user.designationTitle}` : 'Designation: Not Assigned';
    case 'DEPARTMENT-ADMIN':
      return user.departmentName ? `Department: ${user.departmentName}` : 'Department: Not Assigned';
    case 'CLUB':
      return user.clubName ? `Club: ${user.clubName}` : 'Club: Not Assigned';
    case 'UNION':
      return user.unionName ? `Union: ${user.unionName}` : 'Union: Not Assigned';
    case 'CAMPUS-UNIT':
      return user.campusUnitName ? `Campus Unit: ${user.campusUnitName}` : 'Campus Unit: Not Assigned';
    case 'CAMPUS-SECTION':
      return user.campusSectionName ? `Campus Section: ${user.campusSectionName}` : 'Campus Section: Not Assigned';
    default:
      return 'Not Assigned';
  }
};

export const useUserTable = (options: UseUserTableOptions = {}) => {
  const dispatch = useAppDispatch();

  const useTableData = createTableDataHook<TableData, any>({
    // RTK Query hooks
    useListQuery: useGetUsersQuery,
    useUpdateMutation: usePatchUserMutation,
    useDeleteMutation: useArchiveUserMutation,

    // Set the id of the user being edited
    setId: (id) => {
      dispatch(currentUserId(id));
    },

    // set if edit mode is active
    setEdit: (value) => {
      dispatch(setEdit(value));
    },

    // set the id of the user being viewed
    setViewId: (id) => {
      dispatch(setViewId(id));
    },

    // NOTE - Data transformations api data to table data
    transformResponseToTableData: (apiData) => {
      return apiData?.results.map((item: UserItem) => ({
        ...item,
        roleDisplay: item.roleDisplay || item.role,
        firstName: combineName(item?.firstName, item?.middleName, item?.lastName),
        isActive: item?.isActive ? 'true' : 'false',
        linkedEntity: getLinkedEntityLabel(item)
      }));
    },

    // NOTE - Data transformations table data to api data of inline update
    transformTableDataToUpdateInput: (rowData) => {
      const { firstName, lastName } = splitName(rowData?.firstName); // i have renamed name to firstName for sorting purposes

      return {
        firstName,
        lastName,
        isActive: rowData?.isActive,
        phoneNo: rowData?.phoneNo,
        photo: rowData?.photo
      };
    }
  });

  return () => useTableData({ filters: options.filters });
};
