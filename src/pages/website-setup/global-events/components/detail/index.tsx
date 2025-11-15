import { CircularProgress, Chip } from '@mui/material';
import AppDialog from '@/components/app-dialog';
import { useDispatch, useSelector } from 'react-redux';
import { useRetrieveGlobalEventsQuery } from '../../redux/globalEvents.api';
import { globalEventsState } from '../../redux/globalEvents.selector';
import { clearViewId } from '../../redux/globalEvents.slice';

const formatList = (values?: { name: string }[]) => {
  if (!values || values.length === 0) {
    return '—';
  }
  return values.map((entry) => entry.name).join(', ');
};

const GlobalEventsDetailModal = () => {
  const dispatch = useDispatch();
  const { viewId } = useSelector(globalEventsState);
  const { data, isFetching } = useRetrieveGlobalEventsQuery(viewId, {
    skip: !viewId
  });

  const handleClose = () => {
    dispatch(clearViewId());
  };

  if (!viewId) {
    return null;
  }

  return (
    <AppDialog
      open={Boolean(viewId)}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      content={
        isFetching || !data ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
            <CircularProgress />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{data.title}</h2>
              {data.eventType && <Chip label={data.eventType} size="small" sx={{ mt: 1 }} />}
            </div>
            <p className="text-sm text-gray-600">{data.description || 'No description provided.'}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase text-gray-500">Start Date</p>
                <p className="font-medium">{data.eventStartDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">End Date</p>
                <p className="font-medium">{data.eventEndDate || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Registration Link</p>
                <p className="font-medium">
                  {data.registrationLink ? (
                    <a href={data.registrationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {data.registrationLink}
                    </a>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Location</p>
                <p className="font-medium">{data.location || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Unions</p>
                <p className="font-medium">{formatList(data.unions)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Clubs</p>
                <p className="font-medium">{formatList(data.clubs)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Departments</p>
                <p className="font-medium">{formatList(data.departments)}</p>
              </div>
            </div>
          </div>
        )
      }
    />
  );
};

export default GlobalEventsDetailModal;
