// PACKAGE IMPORTS
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// PROJECT IMPORTS
import AppDialog from '@/components/app-dialog';

// LOCAL IMPORTS
import { useGetDepartmentByIdQuery } from '../../redux/departments.api';
import { departmentState } from '../../redux/departments.selector';
import { clearDepartmentData, setEdit } from '../../redux/departments.slice';
import DepartmentUpdateForm from './Form';

const DepartmentEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(departmentState);

  // Only fetch when we have a valid ID and are in edit mode
  const { data: departmentData, isLoading } = useGetDepartmentByIdQuery(currentId, { skip: !currentId || !edit });

  // If the either of value is not set, we don't need to show the modal
  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearDepartmentData());
  };

  return (
    <AppDialog
      open={edit}
      onClose={handleClose}
      fullWidth
      content={
        isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <DepartmentUpdateForm departmentData={departmentData} onClose={handleClose} />
        )
      }
    />
  );
};

export default DepartmentEditModal;
