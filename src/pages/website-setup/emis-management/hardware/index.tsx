import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Avatar,
  Fab,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  PhotoCamera as PhotoCameraIcon,
  Router as RouterIcon,
  Computer as ComputerIcon,
  Security as SecurityIcon,
  DeviceHub as DeviceHubIcon,
  Storage as StorageIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
  Scanner as ScannerIcon,
  Monitor as MonitorIcon,
  Laptop as LaptopIcon,
  DesktopWindows as DesktopIcon,
  Tablet as TabletIcon,
  PhoneAndroid as MobileIcon,
  Wifi as AccessPointIcon,
  Dns as ServerIcon,
  AccountTree as NetworkIcon,
  Inventory as RackIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import FileUpload from '@/components/FileUpload';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  useGetEmisHardwareQuery,
  useCreateEmisHardwareMutation,
  useUpdateEmisHardwareMutation,
  useDeleteEmisHardwareMutation
} from '../redux/emis.api';
import { HardwareTypeOption, IEmisHardware, IEmisHardwareCreatePayload } from '../types';

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

const hardwareTypeIcons: Record<HardwareTypeOption | 'default', React.ElementType> = {
  router: RouterIcon,
  switch: DeviceHubIcon,
  server: ServerIcon,
  firewall: SecurityIcon,
  endpoint: StorageIcon,
  storage: StorageIcon,
  ups: StorageIcon,
  printer: PrintIcon,
  telephone: PhoneIcon,
  projector: VideocamIcon,
  camera: VideocamIcon,
  scanner: ScannerIcon,
  monitor: MonitorIcon,
  laptop: LaptopIcon,
  desktop: DesktopIcon,
  tablet: TabletIcon,
  mobile: MobileIcon,
  access_point: AccessPointIcon,
  modem: RouterIcon,
  repeater: NetworkIcon,
  bridge: NetworkIcon,
  gateway: NetworkIcon,
  load_balancer: DeviceHubIcon,
  nas: StorageIcon,
  san: StorageIcon,
  rack: RackIcon,
  pdu: StorageIcon,
  kvm: DeviceHubIcon,
  other: MoreVertIcon,
  default: MoreVertIcon
};

const buildMediaUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = `${import.meta.env.VITE_PUBLIC_APP_HTTP_SCHEME}${import.meta.env.VITE_PUBLIC_APP_BASE_URL}`;
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

const HardwareManagement = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<IEmisHardware | null>(null);
  const [viewDialog, setViewDialog] = useState<IEmisHardware | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<IEmisHardware | null>(null);

  const { data: hardwareData, isLoading, error: hardwareError, refetch } = useGetEmisHardwareQuery();
  const [createHardware, { isLoading: createLoading }] = useCreateEmisHardwareMutation();
  const [updateHardware, { isLoading: updateLoading }] = useUpdateEmisHardwareMutation();
  const [deleteHardware, { isLoading: deleteLoading }] = useDeleteEmisHardwareMutation();

  const extractErrorMessage = (error: any, fallback: string) => {
    if (!error) return fallback;
    if (typeof error === 'string') return error;
    if (typeof error?.data === 'string') return error.data;
    return error?.data?.detail || error?.data?.message || fallback;
  };

  const form = useForm<IEmisHardwareCreatePayload>({
    defaultValues: {
      name: '',
      asset_tag: '',
      hardware_type: 'server',
      ip_address: '',
      location: '',
      environment: 'production',
      status: 'operational',
      description: '',
      specifications: {},
      thumbnail_image: null
    }
  });

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
      refetch();
    } catch (error: any) {
      enqueueSnackbar(extractErrorMessage(error, 'Failed to save hardware'), { variant: 'error' });
    }
  };

  const handleEdit = (item: IEmisHardware) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      asset_tag: item.asset_tag || '',
      hardware_type: item.hardware_type,
      ip_address: item.ip_address || '',
      location: item.location || '',
      environment: item.environment,
      status: item.status,
      description: item.description || '',
      specifications: item.specifications || {},
      thumbnail_image: null // Don't prefill image
    });
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    try {
      const response = await deleteHardware(deleteDialog.id).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      setDeleteDialog(null);
      refetch();
    } catch (error: any) {
      enqueueSnackbar(extractErrorMessage(error, 'Failed to delete hardware'), { variant: 'error' });
    }
  };

  const handleNewItem = () => {
    setEditingItem(null);
    form.reset({
      name: '',
      asset_tag: '',
      hardware_type: 'server',
      ip_address: '',
      location: '',
      environment: 'production',
      status: 'operational',
      description: '',
      specifications: {},
      thumbnail_image: null
    });
    setOpenDialog(true);
  };

  const getHardwareLabel = (type?: string | null) => {
    if (type && Object.prototype.hasOwnProperty.call(hardwareTypeLabels, type)) {
      return hardwareTypeLabels[type as HardwareTypeOption];
    }
    return hardwareTypeLabels.default;
  };

  const getHardwareIcon = (type?: string | null) => {
    const iconKey = type && Object.prototype.hasOwnProperty.call(hardwareTypeIcons, type) ? (type as HardwareTypeOption) : 'default';
    const IconComponent = hardwareTypeIcons[iconKey];
    return <IconComponent />;
  };

  const filteredHardware =
    hardwareData?.results?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hardware_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Loading hardware data...</Typography>
      </Box>
    );
  }

  // Handle error state
  if (hardwareError) {
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
          <Button variant="contained" onClick={refetch}>
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

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search hardware by name, type, or location..."
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

      {/* Hardware Grid */}
      <Grid container spacing={3}>
        {filteredHardware.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia sx={{ height: 200, position: 'relative', bgcolor: 'grey.100' }}>
                {item.thumbnail_image ? (
                  <img
                    src={buildMediaUrl(item.thumbnail_image)}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.200'
                    }}
                  >
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>{getHardwareIcon(item.hardware_type)}</Avatar>
                  </Box>
                )}
                <Chip
                  label={getHardwareLabel(item.hardware_type)}
                  color="primary"
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                />
              </CardMedia>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.ip_address || 'No IP Address'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.location || 'No Location'}
                </Typography>
                {item.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
              </CardContent>

              <Box sx={{ p: 1, pt: 0 }}>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={() => setViewDialog(item)} color="primary">
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEdit(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setDeleteDialog(item)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
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
                render={({ field }) => (
                  <TextField select label="Hardware Type" fullWidth {...field}>
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
                    render={({ field }) => (
                      <TextField select label="Environment" fullWidth {...field}>
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
                    render={({ field }) => (
                      <TextField select label="Status" fullWidth {...field}>
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
                name="thumbnail_image"
                control={form.control}
                render={({ field }) => (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Hardware Image
                    </Typography>
                    <FileUpload
                      accept="image/*"
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                      helperText="Upload a thumbnail image for this hardware"
                    />
                  </Box>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field }) => <TextField label="Description" fullWidth multiline rows={3} {...field} />}
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
                <strong>Type:</strong> {getHardwareLabel(viewDialog.hardware_type)}
              </Typography>
              <Typography>
                <strong>IP Address:</strong> {viewDialog.ip_address || 'N/A'}
              </Typography>
              <Typography>
                <strong>Location:</strong> {viewDialog.location || 'N/A'}
              </Typography>
              {viewDialog.description && (
                <Typography>
                  <strong>Description:</strong> {viewDialog.description}
                </Typography>
              )}
              {viewDialog.specifications && Object.keys(viewDialog.specifications).length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Specifications:
                  </Typography>
                  <pre style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{JSON.stringify(viewDialog.specifications, null, 2)}</pre>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={handleDelete}
        title="Delete Hardware"
        message={`Are you sure you want to delete "${deleteDialog?.name}"? This action cannot be undone.`}
        isLoading={deleteLoading}
      />
    </Box>
  );
};

export default HardwareManagement;
