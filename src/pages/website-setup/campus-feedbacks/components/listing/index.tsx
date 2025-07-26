import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusFeedbacksPermissions } from '../../constants/persmissions';
import { useCampusFeedbacksTable } from '../../hooks/useCampusFeedbacksTable';
import { ITableData, getColumnConfig } from './config';

const CampusFeedbacksListingSection = () => {
  const tableHooks = useCampusFeedbacksTable();
  const canEdit = useHasParticularPermissions(campusFeedbacksPermissions.edit);

  console.log(canEdit);

  return (
    <TableContainer<ITableData>
      title="Campus Feedbacks"
      useTableHook={tableHooks}
      getColumnConfig={getColumnConfig}
      createButtonTitle="Add"
      createNewForm={undefined}
      allowEditing={canEdit}
      allowDeleting={false}
    />
  );
};

export default CampusFeedbacksListingSection;
