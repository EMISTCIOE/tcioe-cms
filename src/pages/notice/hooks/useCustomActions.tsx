import { Tooltip } from '@mui/material';
import { GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import AssistantPhotoOutlined from '@mui/icons-material/AssistantPhotoOutlined';

import { useDispatch } from 'react-redux';
import { currentNoticeId, setEdit, setIsStatusModal } from '../redux/notice.slice';

import { ITableData } from '../components/listing/config';

interface UseCustomActionsProps {
  canUpdateStatus: boolean;
}

export const useCustomActions = ({ canUpdateStatus }: UseCustomActionsProps) => {
  const dispatch = useDispatch();

  const actions = [];

  // Only add status update action if user has permission
  if (canUpdateStatus) {
    actions.push((params: GridRowParams<ITableData>) => (
      <GridActionsCellItem
        key="update-status"
        sx={{
          ':hover': {
            backgroundColor: (theme) => theme.palette.primary.lighter,
            color: (theme) => theme.palette.primary.main
          }
        }}
        showInMenu
        icon={
          <Tooltip title="Update Status">
            <span>
              <AssistantPhotoOutlined color="primary" sx={{ height: '20px' }} />
            </span>
          </Tooltip>
        }
        label="Update Status"
        onClick={() => {
          dispatch(setIsStatusModal(true));
          dispatch(currentNoticeId(params.id));
          dispatch(setEdit(true));
        }}
      />
    ));
  }

  return actions;
};
