import TableContainer from '@/components/app-table/TableContainer';
import { useHasParticularPermissions } from '@/utils/permissions/helpers';
import { campusFeedbacksPermissions } from '../../constants/persmissions';
import { useCampusFeedbacksTable } from '../../hooks/useCampusFeedbacksTable';
import { ITableData, getColumnConfig } from './config';
import { GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useResolveCampusFeedbacksMutation } from '../../redux/campusFeedbacks.api';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';

const CampusFeedbacksListingSection = () => {
  const dispatch = useAppDispatch();
  const tableHooks = useCampusFeedbacksTable();
  const canEdit = useHasParticularPermissions(campusFeedbacksPermissions.edit);
  const [resolveDialog, setResolveDialog] = useState<{ open: boolean; row: ITableData | null; reply: string }>({
    open: false,
    row: null,
    reply: ''
  });
  const [resolveFeedback, { isLoading: isResolving }] = useResolveCampusFeedbacksMutation();

  const handleResolve = (row: ITableData) => {
    setResolveDialog({ open: true, row, reply: row.responseMessage || '' });
  };

  const handleClose = () => setResolveDialog({ open: false, row: null, reply: '' });

  const handleSubmit = async () => {
    if (!resolveDialog.row) return;
    try {
      await resolveFeedback({
        id: resolveDialog.row.id,
        values: { isResolved: true, responseMessage: resolveDialog.reply }
      }).unwrap();
      dispatch(setMessage({ message: 'Reply sent and feedback marked as resolved', variant: 'success' }));
      handleClose();
    } catch {
      dispatch(setMessage({ message: 'Failed to resolve feedback', variant: 'error' }));
    }
  };

  const customActions = [
    (params: GridRowParams<ITableData>) =>
      canEdit ? (
        <GridActionsCellItem
          key="resolve"
          showInMenu
          icon={<MarkEmailReadIcon color="primary" />}
          label="Resolve & Reply"
          onClick={() => handleResolve(params.row)}
        />
      ) : null
  ];

  return (
    <>
      <TableContainer<ITableData>
        title="Campus Feedbacks"
        useTableHook={tableHooks}
        getColumnConfig={(theme) => getColumnConfig(theme, customActions)}
        createButtonTitle="Add"
        createNewForm={undefined}
        allowEditing={false}
        allowDeleting={false}
      />

      <Dialog open={resolveDialog.open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Resolve &amp; Reply</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Reply message"
              multiline
              minRows={4}
              fullWidth
              value={resolveDialog.reply}
              onChange={(e) => setResolveDialog((prev) => ({ ...prev, reply: e.target.value }))}
              placeholder="Write a response that will be emailed to the sender"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <LoadingButton onClick={handleClose} color="inherit">
            Cancel
          </LoadingButton>
          <LoadingButton variant="contained" onClick={handleSubmit} loading={isResolving} disabled={!resolveDialog.reply.trim()}>
            Send reply &amp; resolve
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CampusFeedbacksListingSection;
