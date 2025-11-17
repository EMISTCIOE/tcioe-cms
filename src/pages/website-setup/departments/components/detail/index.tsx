import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Components
import AppDialog from '@/components/app-dialog';
import { useGetDepartmentByIdQuery } from '../../redux/departments.api';
import { departmentState } from '../../redux/departments.selector';
import { clearViewId } from '../../redux/departments.slice';
import DetailView from './DetailView';

const DepartmentDetailsModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(departmentState);

  // Only fetch when we have a valid ID of department
  const { data: departmentData, isLoading } = useGetDepartmentByIdQuery(viewId, { skip: !viewId });

  if (!viewId) {
    return null;
  }

  const handleClose = () => {
    dispatch(clearViewId());
  };

  return (
    <AppDialog
      open={!!viewId}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      content={
        isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <DetailView departmentData={departmentData} onClose={handleClose} />
        )
      }
    />
  );
};

export default DepartmentDetailsModal;
