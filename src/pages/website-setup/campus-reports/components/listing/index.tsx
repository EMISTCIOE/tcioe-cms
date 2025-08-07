import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusReportsPermissions } from '../../constants/persmissions';
import { useCampusReportsTable } from '../../hooks/useCampusReportsTable';
import { ITableData, getColumnConfig } from './config';
import { useTheme } from '@mui/material';

const CampusReportsCreateForm = lazy(() => import('../create-form'));

const CampusReportsListingSection = () => {
  const theme = useTheme();
  const { tableDataHook, isOptionsLoaded, fiscalSessionsOptions } = useCampusReportsTable();

  const canCreate = useHasParticularPermissions(campusReportsPermissions.add);
  const canEdit = useHasParticularPermissions(campusReportsPermissions.edit);
  const canDelete = useHasParticularPermissions(campusReportsPermissions.delete);

  if (!isOptionsLoaded) {
    return null;
  }

  return (
    <TableContainer<ITableData>
      title="Campus Reports"
      useTableHook={tableDataHook}
      getColumnConfig={() =>
        getColumnConfig(
          theme,
          fiscalSessionsOptions.map((option) => ({ label: option.label, value: option.value }))
        )
      }
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <CampusReportsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default CampusReportsListingSection;
