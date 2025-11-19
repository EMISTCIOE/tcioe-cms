import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  InputAdornment,
  Tabs,
  Tab,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Computer as ComputerIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkCheckIcon,
  Domain as DomainIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  useGetEmisVpsInfoQuery,
  useCreateEmisVpsInfoMutation,
  useUpdateEmisVpsInfoMutation,
  useDeleteEmisVpsInfoMutation,
  useGetEmisVpsServicesQuery,
  useCreateEmisVpsServiceMutation,
  useUpdateEmisVpsServiceMutation,
  useDeleteEmisVpsServiceMutation
} from '../redux/emis.api';
import { IEmisVpsInfo, IEmisVpsService, IEmisVpsInfoCreatePayload, IEmisVpsServiceCreatePayload } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const VPSManagement = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openVpsDialog, setOpenVpsDialog] = useState(false);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [editingVps, setEditingVps] = useState<IEmisVpsInfo | null>(null);
  const [editingService, setEditingService] = useState<IEmisVpsService | null>(null);
  const [viewVpsDialog, setViewVpsDialog] = useState<IEmisVpsInfo | null>(null);
  const [deleteVpsDialog, setDeleteVpsDialog] = useState<IEmisVpsInfo | null>(null);
  const [deleteServiceDialog, setDeleteServiceDialog] = useState<IEmisVpsService | null>(null);
  const [expandedVps, setExpandedVps] = useState<string[]>([]);

  const { data: vpsData, isLoading: vpsLoading, error: vpsError, refetch: refetchVps } = useGetEmisVpsInfoQuery();
  const { data: servicesData, error: servicesError, refetch: refetchServices } = useGetEmisVpsServicesQuery();
  const [createVps, { isLoading: createVpsLoading }] = useCreateEmisVpsInfoMutation();
  const [updateVps, { isLoading: updateVpsLoading }] = useUpdateEmisVpsInfoMutation();
  const [deleteVps, { isLoading: deleteVpsLoading }] = useDeleteEmisVpsInfoMutation();
  const [createService, { isLoading: createServiceLoading }] = useCreateEmisVpsServiceMutation();
  const [updateService, { isLoading: updateServiceLoading }] = useUpdateEmisVpsServiceMutation();
  const [deleteService, { isLoading: deleteServiceLoading }] = useDeleteEmisVpsServiceMutation();

  const vpsForm = useForm<IEmisVpsInfoCreatePayload>({
    defaultValues: {
      vps_name: '',
      ip_address: '',
      ram_gb: 1,
      cpu_cores: 1,
      storage_gb: 10,
      description: '',
      notes: ''
    }
  });

  const serviceForm = useForm<IEmisVpsServiceCreatePayload>({
    defaultValues: {
      vps: '',
      name: '',
      port: 80,
      service_type: '',
      domain: '',
      is_ssl_enabled: false,
      description: ''
    }
  });

  const handleVpsSubmit = async (values: IEmisVpsInfoCreatePayload) => {
    try {
      const response = editingVps ? await updateVps({ id: editingVps.id, data: values }).unwrap() : await createVps(values).unwrap();

      dispatch(setMessage({ message: response.message, variant: 'success' }));
      setOpenVpsDialog(false);
      setEditingVps(null);
      vpsForm.reset();
      refetchVps();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to save VPS', { variant: 'error' });
    }
  };

  const handleServiceSubmit = async (values: IEmisVpsServiceCreatePayload) => {
    try {
      const response = editingService
        ? await updateService({ id: editingService.id, data: values }).unwrap()
        : await createService(values).unwrap();

      dispatch(setMessage({ message: response.message, variant: 'success' }));
      setOpenServiceDialog(false);
      setEditingService(null);
      serviceForm.reset();
      refetchServices();
      refetchVps(); // Refresh to update service counts
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to save service', { variant: 'error' });
    }
  };

  const handleEditVps = (item: IEmisVpsInfo) => {
    setEditingVps(item);
    vpsForm.reset({
      vps_name: item.vps_name,
      ip_address: item.ip_address,
      ram_gb: item.ram_gb,
      cpu_cores: item.cpu_cores,
      storage_gb: item.storage_gb || 10,
      description: item.description || '',
      notes: item.notes || ''
    });
    setOpenVpsDialog(true);
  };

  const handleEditService = (item: IEmisVpsService) => {
    setEditingService(item);
    serviceForm.reset({
      vps: item.vps.toString(),
      name: item.name,
      port: item.port,
      service_type: item.service_type,
      domain: item.domain,
      is_ssl_enabled: item.is_ssl_enabled,
      description: item.description || ''
    });
    setOpenServiceDialog(true);
  };

  const handleDeleteVps = async () => {
    if (!deleteVpsDialog) return;

    try {
      const response = await deleteVps(deleteVpsDialog.id).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      setDeleteVpsDialog(null);
      refetchVps();
      refetchServices();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to delete VPS', { variant: 'error' });
    }
  };

  const handleDeleteService = async () => {
    if (!deleteServiceDialog) return;

    try {
      const response = await deleteService(deleteServiceDialog.id).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      setDeleteServiceDialog(null);
      refetchServices();
      refetchVps(); // Refresh to update service counts
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to delete service', { variant: 'error' });
    }
  };

  const handleNewVps = () => {
    setEditingVps(null);
    vpsForm.reset({
      vps_name: '',
      ip_address: '',
      ram_gb: 1,
      cpu_cores: 1,
      storage_gb: 10,
      description: '',
      notes: ''
    });
    setOpenVpsDialog(true);
  };

  const handleNewService = () => {
    setEditingService(null);
    serviceForm.reset({
      vps: '',
      name: '',
      port: 80,
      service_type: '',
      domain: '',
      is_ssl_enabled: false,
      description: ''
    });
    setOpenServiceDialog(true);
  };

  const toggleVpsExpansion = (vpsId: string) => {
    setExpandedVps((prev) => (prev.includes(vpsId) ? prev.filter((id) => id !== vpsId) : [...prev, vpsId]));
  };

  const filteredVps =
    vpsData?.results?.filter(
      (item) =>
        item.vps_name.toLowerCase().includes(searchTerm.toLowerCase()) || item.ip_address?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getServicesForVps = (vpsId: string) => {
    return servicesData?.results?.filter((service) => service.vps.toString() === vpsId) || [];
  };

  // Handle loading state
  if (vpsLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Loading VPS data...</Typography>
      </Box>
    );
  }

  // Handle error state
  if (vpsError || servicesError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          VPS Management
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error Loading Data
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {vpsError ? 'Failed to load VPS information. ' : ''}
            {servicesError ? 'Failed to load services information. ' : ''}
            Please check your permissions or contact administrator.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              refetchVps();
              refetchServices();
            }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">VPS Management</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleNewService}>
            Add Service
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewVps}>
            Add VPS
          </Button>
        </Stack>
      </Stack>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search VPS by name or IP address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* VPS Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>VPS Name</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell align="center">RAM (GB)</TableCell>
              <TableCell align="center">CPU Cores</TableCell>
              <TableCell align="center">Services</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVps.map((vps) => (
              <React.Fragment key={vps.id}>
                <TableRow hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton size="small" onClick={() => toggleVpsExpansion(vps.id)}>
                        {expandedVps.includes(vps.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {vps.vps_name}
                        </Typography>
                        {vps.description && (
                          <Typography variant="body2" color="text.secondary">
                            {vps.description}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {vps.ip_address}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip icon={<MemoryIcon />} label={`${vps.ram_gb} GB`} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip icon={<ComputerIcon />} label={`${vps.cpu_cores} cores`} size="small" color="secondary" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={`${vps.services_count || 0} services`} size="small" color={vps.services_count ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton size="small" onClick={() => setViewVpsDialog(vps)} color="primary">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditVps(vps)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleteVpsDialog(vps)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>

                {/* Services Expansion */}
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 0 }}>
                    <Collapse in={expandedVps.includes(vps.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Services on {vps.vps_name}
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Service Name</TableCell>
                              <TableCell>IP:Port</TableCell>
                              <TableCell>Service Type</TableCell>
                              <TableCell>Domain</TableCell>
                              <TableCell>SSL</TableCell>
                              <TableCell align="center">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {getServicesForVps(vps.id).map((service) => (
                              <TableRow key={service.id}>
                                <TableCell>
                                  <Typography variant="body2" fontWeight="medium">
                                    {service.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontFamily="monospace">
                                    {vps.ip_address}:{service.port}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{service.service_type}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{service.domain}</Typography>
                                </TableCell>
                                <TableCell>
                                  {service.is_ssl_enabled ? (
                                    <LockIcon color="success" fontSize="small" />
                                  ) : (
                                    <LockOpenIcon color="disabled" fontSize="small" />
                                  )}
                                </TableCell>
                                <TableCell align="center">
                                  <Stack direction="row" spacing={1} justifyContent="center">
                                    <IconButton size="small" onClick={() => handleEditService(service)} color="primary">
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => setDeleteServiceDialog(service)} color="error">
                                      <DeleteIcon />
                                    </IconButton>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            ))}
                            {getServicesForVps(vps.id).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} align="center">
                                  <Typography variant="body2" color="text.secondary">
                                    No services configured for this VPS
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* VPS Dialog */}
      <Dialog open={openVpsDialog} onClose={() => setOpenVpsDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={vpsForm.handleSubmit(handleVpsSubmit)}>
          <DialogTitle>{editingVps ? 'Edit VPS' : 'Add New VPS'}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Controller
                name="vps_name"
                control={vpsForm.control}
                rules={{ required: 'VPS name is required' }}
                render={({ field, fieldState }) => (
                  <TextField label="VPS Name" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />
                )}
              />

              <Controller
                name="ip_address"
                control={vpsForm.control}
                rules={{ required: 'IP address is required' }}
                render={({ field, fieldState }) => (
                  <TextField label="IP Address" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />
                )}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="ram_gb"
                    control={vpsForm.control}
                    rules={{ required: 'RAM is required', min: { value: 1, message: 'Minimum 1 GB' } }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="RAM (GB)"
                        type="number"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="cpu_cores"
                    control={vpsForm.control}
                    rules={{ required: 'CPU cores required', min: { value: 1, message: 'Minimum 1 core' } }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="CPU Cores"
                        type="number"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="storage_gb"
                    control={vpsForm.control}
                    render={({ field }) => <TextField label="Storage (GB)" type="number" fullWidth {...field} />}
                  />
                </Grid>
              </Grid>

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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenVpsDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createVpsLoading || updateVpsLoading}>
              {editingVps ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={openServiceDialog} onClose={() => setOpenServiceDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={serviceForm.handleSubmit(handleServiceSubmit)}>
          <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Controller
                name="vps"
                control={serviceForm.control}
                rules={{ required: 'VPS is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    select
                    label="VPS Server"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    {...field}
                  >
                    {vpsData?.results?.map((vps) => (
                      <option key={vps.id} value={vps.id}>
                        {vps.vps_name} ({vps.ip_address})
                      </option>
                    ))}
                  </TextField>
                )}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="name"
                    control={serviceForm.control}
                    rules={{ required: 'Service name is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Service Name"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="port"
                    control={serviceForm.control}
                    rules={{ required: 'Port is required', min: { value: 1, message: 'Invalid port' } }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Port"
                        type="number"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name="service_type"
                control={serviceForm.control}
                rules={{ required: 'Service type is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Service Type"
                    fullWidth
                    placeholder="e.g., ecast.service, nginx.service"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="domain"
                control={serviceForm.control}
                rules={{ required: 'Domain is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Domain"
                    fullWidth
                    placeholder="e.g., ecast.tcioe.edu.np"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="is_ssl_enabled"
                control={serviceForm.control}
                render={({ field }) => (
                  <TextField
                    select
                    label="SSL Enabled"
                    fullWidth
                    {...field}
                    value={field.value ? 'true' : 'false'}
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                  >
                    <option value="false">No (HTTP)</option>
                    <option value="true">Yes (HTTPS)</option>
                  </TextField>
                )}
              />

              <Controller
                name="description"
                control={serviceForm.control}
                render={({ field }) => <TextField label="Description" fullWidth multiline rows={2} {...field} />}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenServiceDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createServiceLoading || updateServiceLoading}>
              {editingService ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View VPS Dialog */}
      <Dialog open={!!viewVpsDialog} onClose={() => setViewVpsDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{viewVpsDialog?.vps_name}</DialogTitle>
        <DialogContent>
          {viewVpsDialog && (
            <Stack spacing={2}>
              <Typography>
                <strong>IP Address:</strong> {viewVpsDialog.ip_address}
              </Typography>
              <Typography>
                <strong>RAM:</strong> {viewVpsDialog.ram_gb} GB
              </Typography>
              <Typography>
                <strong>CPU Cores:</strong> {viewVpsDialog.cpu_cores}
              </Typography>
              {viewVpsDialog.storage_gb && (
                <Typography>
                  <strong>Storage:</strong> {viewVpsDialog.storage_gb} GB
                </Typography>
              )}
              {viewVpsDialog.description && (
                <Typography>
                  <strong>Description:</strong> {viewVpsDialog.description}
                </Typography>
              )}
              {viewVpsDialog.notes && (
                <Typography>
                  <strong>Notes:</strong> {viewVpsDialog.notes}
                </Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewVpsDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmations */}
      <ConfirmDialog
        open={!!deleteVpsDialog}
        onClose={() => setDeleteVpsDialog(null)}
        onConfirm={handleDeleteVps}
        title="Delete VPS"
        content={`Are you sure you want to delete VPS "${deleteVpsDialog?.vps_name}"? This will also delete all associated services.`}
        loading={deleteVpsLoading}
      />

      <ConfirmDialog
        open={!!deleteServiceDialog}
        onClose={() => setDeleteServiceDialog(null)}
        onConfirm={handleDeleteService}
        title="Delete Service"
        content={`Are you sure you want to delete service "${deleteServiceDialog?.name}"?`}
        loading={deleteServiceLoading}
      />
    </Box>
  );
};

export default VPSManagement;
