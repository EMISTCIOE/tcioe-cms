import { lazy } from 'react';
import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { researchFacilitiesPermissions } from '../../constants/persmissions';
import { useResearchFacilitiesTable } from '../../hooks/useResearchFacilitiesTable';
import { ITableData, getColumnConfig } from './config';

const ResearchFacilitiesCreateForm = lazy(() => import('../create-form'));

const ResearchFacilitiesListingSection = () => {
  const tableHooks = useResearchFacilitiesTable();

  const canCreate = useHasParticularPermissions(researchFacilitiesPermissions.add);
  const canEdit = useHasParticularPermissions(researchFacilitiesPermissions.edit);
  const canDelete = useHasParticularPermissions(researchFacilitiesPermissions.delete);

  return (
    <TableContainer<ITableData>
      title="Research Facilities"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={canCreate ? (onClose) => <ResearchFacilitiesCreateForm onClose={onClose} /> : undefined}
      allowEditing={canEdit}
      allowDeleting={canDelete}
    />
  );
};

export default ResearchFacilitiesListingSection;
