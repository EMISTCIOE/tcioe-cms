import { CircularProgress } from '@mui/material';
import AppDialog from '@/components/app-dialog';
import { useDispatch, useSelector } from 'react-redux';
import {
  useRetrieveGlobalEventsQuery
} from '../../redux/globalEvents.api';
import { globalEventsState } from '../../redux/globalEvents.selector';
import { clearGlobalEventsData, setEdit } from '../../redux/globalEvents.slice';
import GlobalEventsUpdateForm from './Form';

const GlobalEventsEditModal = () => {
  const dispatch = useDispatch();
  const { edit, currentId } = useSelector(globalEventsState);

  const { data, isFetching } = useRetrieveGlobalEventsQuery(currentId, {
    skip: !currentId || !edit
  });

  if (!currentId || !edit) {
    return null;
  }

  const handleClose = () => {
    dispatch(setEdit(false));
    dispatch(clearGlobalEventsData());
  };

  return (
    <AppDialog
      open={edit}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      content={
        isFetching ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
            <CircularProgress />
          </div>
        ) : (
          <GlobalEventsUpdateForm eventData={data} onClose={handleClose} />
        )
      }
    />
  );
};

export default GlobalEventsEditModal;
