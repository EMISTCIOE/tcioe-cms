import { useSnackbar } from 'notistack';
import { Grid, Paper, Typography, TextField, MenuItem, Stack, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import {
  useCreateEmailResetRequestMutation,
  useCreateEmisHardwareMutation,
  useCreateEmisVpsInfoMutation,
  useGetEmailResetRequestsQuery,
  useGetEmisHardwareQuery,
  useGetEmisVpsInfoQuery
} from './redux/emis.api';
import { HardwareTypeOption, IEmailResetRequestCreatePayload, IEmisHardwareCreatePayload, IEmisVpsInfoCreatePayload } from './types';

const hardwareTypeLabels: Record<HardwareTypeOption, string> = {
  router: 'Router',
  switch: 'Switch',
  server: 'Server',
  firewall: 'Firewall',
  endpoint: 'Endpoint',
  other: 'Other'
};

const ManageEmisPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { data: hardwareData, refetch: refetchHardware } = useGetEmisHardwareQuery();
  const { data: vpsData, refetch: refetchVps } = useGetEmisVpsInfoQuery();
  const { data: resetData, refetch: refetchReset } = useGetEmailResetRequestsQuery();
  const [createHardware, { isLoading: hardwareLoading }] = useCreateEmisHardwareMutation();
  const [createVps, { isLoading: vpsLoading }] = useCreateEmisVpsInfoMutation();
  const [createReset, { isLoading: resetLoading }] = useCreateEmailResetRequestMutation();

  const hardwareForm = useForm<IEmisHardwareCreatePayload>({
    defaultValues: {
      name: '',
      hardware_type: 'server',
      ip_address: '',
      location: '',
      description: ''
    }
  });
  const vpsForm = useForm<IEmisVpsInfoCreatePayload>({
    defaultValues: {
      vps_label: '',
      ip_address: '',
      description: '',
      notes: ''
    }
  });
  const resetForm = useForm<IEmailResetRequestCreatePayload>({
    defaultValues: {
      full_name: '',
      roll_number: '',
      birth_date: '',
      primary_email: '',
      secondary_email: ''
    }
  });

  const submitHardware = async (values: IEmisHardwareCreatePayload) => {
    try {
      const response = await createHardware(values).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      hardwareForm.reset();
      refetchHardware();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to save hardware', { variant: 'error' });
    }
  };

  const submitVps = async (values: IEmisVpsInfoCreatePayload) => {
    try {
      const response = await createVps(values).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      vpsForm.reset();
      refetchVps();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to save VPS info', { variant: 'error' });
    }
  };

  const submitReset = async (values: IEmailResetRequestCreatePayload) => {
    try {
      const response = await createReset(values).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      resetForm.reset();
      refetchReset();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to create reset request', { variant: 'error' });
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Manage EMIS Resources</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">EMIS Hardware</Typography>
            <List dense>
              {hardwareData?.results.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={`${item.name} (${hardwareTypeLabels[item.hardware_type]})`}
                    secondary={`${item.ip_address ?? 'No IP'} · ${item.location ?? 'No location'}`}
                  />
                </ListItem>
              ))}
              {!hardwareData?.results.length && <Typography variant="body2">No hardware entries yet.</Typography>}
            </List>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={hardwareForm.handleSubmit(submitHardware)} noValidate>
              <Typography variant="subtitle1">Add Hardware</Typography>
              <Stack spacing={2} mt={2}>
                <Controller
                  name="name"
                  control={hardwareForm.control}
                  rules={{ required: 'Hardware name is required' }}
                  render={({ field, fieldState }) => (
                    <TextField label="Name" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />
                  )}
                />
                <Controller
                  name="hardware_type"
                  control={hardwareForm.control}
                  render={({ field }) => (
                    <TextField select label="Type" fullWidth {...field}>
                      {Object.entries(hardwareTypeLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="ip_address"
                  control={hardwareForm.control}
                  render={({ field }) => <TextField label="IP Address" fullWidth {...field} />}
                />
                <Controller
                  name="location"
                  control={hardwareForm.control}
                  render={({ field }) => <TextField label="Location" fullWidth {...field} />}
                />
                <Controller
                  name="description"
                  control={hardwareForm.control}
                  render={({ field }) => <TextField label="Description" fullWidth multiline rows={2} {...field} />}
                />
                <Button variant="contained" type="submit" disabled={hardwareLoading}>
                  Save Hardware
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">EMIS VPS Info</Typography>
            <List dense>
              {vpsData?.results.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText primary={item.vps_label} secondary={`${item.ip_address ?? 'No IP'} · ${item.notes ?? ''}`} />
                </ListItem>
              ))}
              {!vpsData?.results.length && <Typography variant="body2">No VPS entries yet.</Typography>}
            </List>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={vpsForm.handleSubmit(submitVps)} noValidate>
              <Typography variant="subtitle1">Add VPS Entry</Typography>
              <Stack spacing={2} mt={2}>
                <Controller
                  name="vps_label"
                  control={vpsForm.control}
                  rules={{ required: 'Label required' }}
                  render={({ field, fieldState }) => <TextField label="Label" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />}
                />
                <Controller
                  name="ip_address"
                  control={vpsForm.control}
                  rules={{ required: 'IP required' }}
                  render={({ field, fieldState }) => <TextField label="IP Address" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />}
                />
                <Controller
                  name="description"
                  control={vpsForm.control}
                  render={({ field }) => <TextField label="Description" fullWidth multiline rows={2} {...field} />}
                />
                <Controller
                  name="notes"
                  control={vpsForm.control}
                  render={({ field }) => <TextField label="Notes" fullWidth multiline rows={2} {...field} />}
                />
                <Button variant="contained" type="submit" disabled={vpsLoading}>
                  Save VPS
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Email Reset Requests</Typography>
        <Grid container spacing={2}>
          {resetData?.results.map((request) => (
            <Grid item xs={12} sm={6} md={4} key={request.id}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2">{request.full_name}</Typography>
                <Typography variant="body2">Roll: {request.roll_number}</Typography>
                <Typography variant="body2">Remaining: {request.requests_remaining}</Typography>
              </Paper>
            </Grid>
          ))}
          {!resetData?.results.length && (
            <Grid item xs={12}>
              <Typography variant="body2">No reset requests yet.</Typography>
            </Grid>
          )}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={resetForm.handleSubmit(submitReset)} noValidate>
          <Typography variant="subtitle1">Create Reset Request</Typography>
          <Stack spacing={2} mt={2}>
            <Controller
              name="full_name"
              control={resetForm.control}
              rules={{ required: 'Name required' }}
              render={({ field, fieldState }) => <TextField label="Full Name" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />}
            />
            <Controller
              name="roll_number"
              control={resetForm.control}
              rules={{ required: 'Roll required' }}
              render={({ field, fieldState }) => <TextField label="Roll Number" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />}
            />
            <Controller
              name="birth_date"
              control={resetForm.control}
              render={({ field }) => <TextField label="Birth Date" type="date" fullWidth InputLabelProps={{ shrink: true }} {...field} />}
            />
            <Controller
              name="primary_email"
              control={resetForm.control}
              rules={{ required: 'Primary email required' }}
              render={({ field, fieldState }) => <TextField label="Primary Email" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />}
            />
            <Controller
              name="secondary_email"
              control={resetForm.control}
              rules={{ required: 'Secondary email required' }}
              render={({ field, fieldState }) => <TextField label="Secondary Email" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />}
            />
            <Button variant="contained" type="submit" disabled={resetLoading}>
              Create Reset Request
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
};

export default ManageEmisPage;
