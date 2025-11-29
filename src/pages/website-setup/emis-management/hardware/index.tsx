import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Button,
  Paper,
  Grid
} from '@mui/material';
import { Add as AddIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import FileUpload from '@/components/FileUpload';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import AppTable from '@/components/app-table';
import { useCreateEmisHardwareMutation, useUpdateEmisHardwareMutation } from '../redux/emis.api';
import { HardwareTypeOption, IEmisHardware, IEmisHardwareCreatePayload } from '../types';
import { useHardwareTable } from './useHardwareTable';
import { getHardwareColumnConfig } from './table-config';

const hardwareTypeLabels: Record<HardwareTypeOption | 'default', string> = {
  router: 'Router',
  switch: 'Switch',
  server: 'Server',
  firewall: 'Firewall',
  endpoint: 'Endpoint',
  storage: 'Storage',
  ups: 'UPS',
  printer: 'Printer',
  telephone: 'Telephone',
  projector: 'Projector',
  camera: 'Camera',
  scanner: 'Scanner',
  monitor: 'Monitor',
  laptop: 'Laptop',
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile Device',
  access_point: 'Access Point',
  modem: 'Modem',
  repeater: 'Repeater',
  bridge: 'Bridge',
  gateway: 'Gateway',
  load_balancer: 'Load Balancer',
  nas: 'NAS',
  san: 'SAN',
  rack: 'Server Rack',
  pdu: 'Power Distribution Unit',
  kvm: 'KVM Switch',
  other: 'Other',
  default: 'Hardware'
};

const buildMediaUrl = (url?: string | null) => {
  if (!url) return '';
  // If URL is already complete, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // If URL starts with /media, it's relative to backend base
  if (url.startsWith('/media')) {
    const baseUrl = import.meta.env.VITE_PUBLIC_APP_BASE_URL;
    // Remove /api/ from the base URL for media files
    const mediaBaseUrl = baseUrl.replace('/api/', '');
    return `${import.meta.env.VITE_PUBLIC_APP_HTTP_SCHEME}${mediaBaseUrl}${url}`;
  }
  // Default case - build full URL
  const base = `${import.meta.env.VITE_PUBLIC_APP_HTTP_SCHEME}${import.meta.env.VITE_PUBLIC_APP_BASE_URL}`;
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

const HardwareManagement = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<IEmisHardware | null>(null);
  const [viewDialog, setViewDialog] = useState<IEmisHardware | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<IEmisHardware | null>(null);

  // API mutations
  const [createHardware, { isLoading: createLoading }] = useCreateEmisHardwareMutation();
  const [updateHardware, { isLoading: updateLoading }] = useUpdateEmisHardwareMutation();

  // Table hook
  const tableHook = useHardwareTable();

  const extractErrorMessage = (error: any, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === 'string') return error;
    if (typeof error?.data === 'string') return error.data;
    return error?.data?.detail || error?.data?.message || fallback;
  };

  // Form handling
  const form = useForm<IEmisHardwareCreatePayload>({
    defaultValues: {
      name: '',
      asset_tag: '',
      hardware_type: 'server',
      environment: 'production',
      status: 'operational',
      manufacturer: '',
      model_number: '',
      serial_number: '',
      ip_address: '',
      location: '',
      responsible_team: '',
      description: '',
      thumbnail_image: null
    }
  });

  // Table action handlers
  const handleView = (id: string) => {
    const item = tableHook.rows.find((hardware) => hardware.id === id);
    if (item) {
      setViewDialog(item);
    }
  };

  const handleEdit = (id: string) => {
    const item = tableHook.rows.find((hardware) => hardware.id === id);
    if (item) {
      setEditingItem(item);
      form.reset({
        name: item.name || '',
        asset_tag: item.asset_tag || '',
        hardware_type: item.hardware_type || 'server',
        environment: item.environment || 'production',
        status: item.status || 'operational',
        manufacturer: item.manufacturer || '',
        model_number: item.model_number || '',
        serial_number: item.serial_number || '',
        ip_address: item.ip_address || '',
        location: item.location || '',
        responsible_team: item.responsible_team || '',
        description: item.description || '',
        thumbnail_image: null
      });
      setOpenDialog(true);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    const item = tableHook.rows.find((hardware) => hardware.id === id);
    if (item) {
      setDeleteDialog(item);
    }
  };

  // Get column configuration with handlers
  const getColumnConfig = getHardwareColumnConfig({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDeleteConfirm
  });

  const handleNewItem = () => {
    setEditingItem(null);
    form.reset({
      name: '',
      asset_tag: '',
      hardware_type: 'server',
      environment: 'production',
      status: 'operational',
      manufacturer: '',
      model_number: '',
      serial_number: '',
      ip_address: '',
      location: '',
      responsible_team: '',
      description: '',
      thumbnail_image: null
    });
    setOpenDialog(true);
  };

  const handleSubmit = async (values: IEmisHardwareCreatePayload) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'specifications' && value) {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'thumbnail_image' && value) {
          formData.append(key, value as File);
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = editingItem
        ? await updateHardware({ id: editingItem.id, data: formData }).unwrap()
        : await createHardware(formData).unwrap();

      dispatch(
        setMessage({
          message: response.message || (editingItem ? 'Hardware updated successfully' : 'Hardware created successfully'),
          variant: 'success'
        })
      );
      setOpenDialog(false);
      setEditingItem(null);
      form.reset();
      tableHook.refetch();
    } catch (error: any) {
      enqueueSnackbar(extractErrorMessage(error, 'Failed to save hardware'), { variant: 'error' });
    }
  };

  const handleDeleteConfirmAction = async () => {
    if (!deleteDialog) return;

    try {
      await tableHook.handleDelete(deleteDialog.id);
      setDeleteDialog(null);
    } catch (error) {
      // Error handling is done in the table hook
    }
  };

  // Create new form component for the table
  const createNewForm = (onClose: () => void) => (
    <Dialog open={openDialog} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogTitle>{editingItem ? 'Edit Hardware' : 'Add New Hardware'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Controller
              name="name"
              control={form.control}
              rules={{ required: 'Name is required' }}
              render={({ field, fieldState }) => (
                <TextField label="Hardware Name" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} {...field} />
              )}
            />

            <Controller
              name="asset_tag"
              control={form.control}
              render={({ field }) => <TextField label="Asset Tag" fullWidth {...field} />}
            />

            <Controller
              name="hardware_type"
              control={form.control}
              rules={{ required: 'Hardware type is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  label="Hardware Type"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  {...field}
                  value={field.value || 'server'} // Ensure value is never undefined
                >
                  {Object.entries(hardwareTypeLabels)
                    .filter(([value]) => value !== 'default')
                    .map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="environment"
                  control={form.control}
                  rules={{ required: 'Environment is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      select
                      label="Environment"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      {...field}
                      value={field.value || 'production'} // Ensure value is never undefined
                    >
                      <MenuItem value="production">Production</MenuItem>
                      <MenuItem value="staging">Staging</MenuItem>
                      <MenuItem value="development">Development</MenuItem>
                      <MenuItem value="lab">Lab</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={form.control}
                  rules={{ required: 'Status is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      select
                      label="Status"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      {...field}
                      value={field.value || 'operational'} // Ensure value is never undefined
                    >
                      <MenuItem value="operational">Operational</MenuItem>
                      <MenuItem value="standby">Standby</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="retired">Retired</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="manufacturer"
                  control={form.control}
                  render={({ field }) => <TextField label="Manufacturer" fullWidth {...field} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="model_number"
                  control={form.control}
                  render={({ field }) => <TextField label="Model Number" fullWidth {...field} />}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="ip_address"
                  control={form.control}
                  render={({ field }) => <TextField label="IP Address" fullWidth {...field} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field }) => <TextField label="Location" fullWidth {...field} />}
                />
              </Grid>
            </Grid>

            <Controller
              name="description"
              control={form.control}
              render={({ field }) => <TextField label="Description" multiline rows={4} fullWidth {...field} />}
            />

            <Controller
              name="thumbnail_image"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Thumbnail Image
                  </Typography>
                  <FileUpload accept="image/*" value={value} onChange={onChange} label="Upload thumbnail image" />
                </Box>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={createLoading || updateLoading}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  // Handle loading and error states
  if (tableHook.error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Hardware Management
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Error Loading Hardware Data
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Failed to load hardware information. Please check your permissions or contact administrator.
          </Typography>
          <Button variant="contained" onClick={tableHook.refetch}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Hardware Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewItem}>
          Add Hardware
        </Button>
      </Stack>

      {/* Hardware Table */}
      <AppTable
        title="Hardware Inventory"
        initialRows={tableHook.rows}
        totalRows={tableHook.totalRowsCount}
        loading={tableHook.loading}
        getColumnConfig={getColumnConfig}
        onSaveRow={tableHook.handleSave}
        onDeleteRow={tableHook.handleDelete}
        handleEditClick={tableHook.handleEditClick}
        onViewDetailsClick={tableHook.handleviewDetailsClick}
        handleRowUpdateError={tableHook.handleRowUpdateError}
        handlePaginationChange={tableHook.handlePaginationChange}
        handleSortChange={tableHook.handleSortChange}
        handleFilterChange={tableHook.handleFilterChange}
        paginationModel={tableHook.paginationModel}
        filterModel={tableHook.filterModel}
        sortModel={tableHook.sortModel}
        pageSizeOptions={tableHook.pageSizeOptions}
        allowEditing={false}
        showSearch={true}
        showFilter={true}
        showColumnFilter={true}
        showDensitySelector={true}
        showExport={true}
        enableRowSelection={false}
        createNewForm={createNewForm}
        createButtonTitle="Add Hardware"
      />

      {/* Add/Edit Dialog */}
      {createNewForm(() => setOpenDialog(false))}

      {/* View Dialog */}
      <Dialog open={!!viewDialog} onClose={() => setViewDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{viewDialog?.name}</DialogTitle>
        <DialogContent>
          {viewDialog && (
            <Stack spacing={2}>
              {viewDialog.thumbnail_image && (
                <Box
                  component="img"
                  src={buildMediaUrl(viewDialog.thumbnail_image)}
                  alt={viewDialog.name}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1
                  }}
                />
              )}
              <Typography>
                <strong>Asset Tag:</strong> {viewDialog.asset_tag || 'N/A'}
              </Typography>
              <Typography>
                <strong>Hardware Type:</strong> {hardwareTypeLabels[viewDialog.hardware_type] || 'N/A'}
              </Typography>
              <Typography>
                <strong>Manufacturer:</strong> {viewDialog.manufacturer || 'N/A'}
              </Typography>
              <Typography>
                <strong>Model:</strong> {viewDialog.model_number || 'N/A'}
              </Typography>
              <Typography>
                <strong>IP Address:</strong> {viewDialog.ip_address || 'N/A'}
              </Typography>
              <Typography>
                <strong>Location:</strong> {viewDialog.location || 'N/A'}
              </Typography>
              <Typography>
                <strong>Environment:</strong> {viewDialog.environment}
              </Typography>
              <Typography>
                <strong>Status:</strong> {viewDialog.status}
              </Typography>
              {viewDialog.description && (
                <Typography>
                  <strong>Description:</strong> {viewDialog.description}
                </Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteDialog}
        title="Delete Hardware"
        message={deleteDialog ? `Are you sure you want to delete the hardware "${deleteDialog.name}"? This action cannot be undone.` : ''}
        onConfirm={handleDeleteConfirmAction}
        onClose={() => setDeleteDialog(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default HardwareManagement;
