import { useTheme } from '@mui/material';
import { lazy } from 'react';

// PROJECT IMPORTS
import TableContainer from '@/components/app-table/TableContainer';

// LOCAL IMPORTS
import { usePhoneNumberTable } from '../hooks/usePhoneNumberTable';
import { ITableData, getColumnConfig } from './listing/config';

// LAZY LOADED COMPONENTS
const PhoneNumberCreateForm = lazy(() => import('../components/create-form'));

const PhoneNumberListing = () => {
  const theme = useTheme();
  const { tableDataHook } = usePhoneNumberTable();

  return (
    <TableContainer<ITableData>
      title="Phone Numbers"
      useTableHook={tableDataHook}
      getColumnConfig={() => getColumnConfig(theme)}
      createButtonTitle="Add Phone Number"
      createNewForm={(onClose) => <PhoneNumberCreateForm onClose={onClose} />}
      allowEditing={true}
      allowDeleting={true}
    />
  );
};

export default PhoneNumberListing;
