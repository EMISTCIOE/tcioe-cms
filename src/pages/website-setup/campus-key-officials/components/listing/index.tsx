import { Theme } from '@mui/material/styles';
import { lazy, useCallback, useMemo } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusKeyOfficialsPermissions } from '../../constants/persmissions';
import { useCampusKeyOfficialsTable } from '../../hooks/useCampusKeyOfficialsTable';
import { useGetCampusStaffDesignationsQuery } from '../../redux/campusKeyOfficials.api';
import { ITableData, getColumnConfig } from './config';

const CampusKeyOfficialsCreateForm = lazy(() => import('../create-form'));

const CampusKeyOfficialsListingSection = () => {
  const tableHooks = useCampusKeyOfficialsTable();
  const { data: designationData } = useGetCampusStaffDesignationsQuery();
  const designationOptions = useMemo(
    () => designationData?.results?.filter((item) => item.isActive).map((item) => ({ label: item.title, value: item.code })) ?? [],
    [designationData]
  );
  const columnConfigBuilder = useCallback((theme: Theme) => getColumnConfig(theme, designationOptions), [designationOptions]);

  const canCreate = useHasParticularPermissions(campusKeyOfficialsPermissions.add);
  const canEdit = useHasParticularPermissions(campusKeyOfficialsPermissions.edit);
  const canDelete = useHasParticularPermissions(campusKeyOfficialsPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Campus Staff"
      useTableHook={tableHooks}
      getColumnConfig={columnConfigBuilder}
      createButtonTitle="Add Staff"
      createNewForm={canCreate ? (onClose) => <CampusKeyOfficialsCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default CampusKeyOfficialsListingSection;
