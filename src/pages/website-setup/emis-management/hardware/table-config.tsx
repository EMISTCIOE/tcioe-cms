import React from 'react';
import { Avatar, Chip, IconButton, Stack, Typography, Box } from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Router as RouterIcon,
  Computer as ComputerIcon,
  Security as SecurityIcon,
  DeviceHub as DeviceHubIcon,
  Storage as StorageIcon,
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
  Inventory as RackIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { GridRowParams } from '@mui/x-data-grid';
import { Theme } from '@mui/material/styles';
import { IEmisHardware, HardwareTypeOption } from '../types';
import { ColumnConfig } from '@/components/app-table/columns/types';

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

const getHardwareIcon = (hardwareType: HardwareTypeOption) => {
  const IconComponent = hardwareTypeIcons[hardwareType] || hardwareTypeIcons.default;
  return <IconComponent fontSize="small" />;
};

const getHardwareLabel = (hardwareType: HardwareTypeOption) => {
  return hardwareTypeLabels[hardwareType] || hardwareTypeLabels.default;
};

interface HardwareColumnConfigProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const getHardwareColumnConfig =
  ({ onView, onEdit, onDelete }: HardwareColumnConfigProps) =>
  (theme: Theme): ColumnConfig<IEmisHardware>[] => [
    {
      field: 'thumbnail_image',
      headerName: 'Image',
      minWidth: 80,
      maxWidth: 80,
      type: 'image',
      editable: false,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const hardware = params.row as IEmisHardware;
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {hardware.thumbnail_image ? (
              <Avatar src={buildMediaUrl(hardware.thumbnail_image)} alt={hardware.name} sx={{ width: 40, height: 40 }} />
            ) : (
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>{getHardwareIcon(hardware.hardware_type)}</Avatar>
            )}
          </Box>
        );
      }
    },
    {
      field: 'name',
      headerName: 'Hardware Name',
      minWidth: 200,
      type: 'text',
      editable: true,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const hardware = params.row as IEmisHardware;
        return (
          <Stack spacing={0.5}>
            <Typography variant="body2" fontWeight="medium">
              {hardware.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {hardware.asset_tag}
            </Typography>
          </Stack>
        );
      }
    },
    {
      field: 'hardware_type',
      headerName: 'Type',
      minWidth: 150,
      maxWidth: 150,
      type: 'select',
      editable: true,
      sortable: true,
      filterable: true,
      valueOptions: Object.entries(hardwareTypeLabels)
        .filter(([value]) => value !== 'default')
        .map(([value, label]) => ({ value, label })),
      renderCell: (params) => {
        const hardware = params.row as IEmisHardware;
        return (
          <Chip
            label={getHardwareLabel(hardware.hardware_type)}
            size="small"
            variant="outlined"
            color="primary"
            icon={getHardwareIcon(hardware.hardware_type)}
          />
        );
      }
    },
    {
      field: 'location',
      headerName: 'Location',
      minWidth: 150,
      type: 'text',
      editable: true,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        return params.value || <Typography color="text.secondary">-</Typography>;
      }
    },
    {
      field: 'ip_address',
      headerName: 'IP Address',
      minWidth: 120,
      type: 'text',
      editable: true,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        return params.value || <Typography color="text.secondary">-</Typography>;
      }
    },
    {
      field: 'environment',
      headerName: 'Environment',
      minWidth: 120,
      maxWidth: 120,
      type: 'select',
      editable: true,
      sortable: true,
      filterable: true,
      valueOptions: [
        { value: 'production', label: 'Production' },
        { value: 'staging', label: 'Staging' },
        { value: 'development', label: 'Development' },
        { value: 'lab', label: 'Lab' }
      ],
      colorMap: {
        production: { backgroundColor: '#ffebee', color: '#d32f2f' },
        staging: { backgroundColor: '#fff3e0', color: '#f57c00' },
        development: { backgroundColor: '#e3f2fd', color: '#1976d2' },
        lab: { backgroundColor: '#f3e5f5', color: '#7b1fa2' }
      },
      renderCell: (params) => {
        const getEnvironmentColor = (env: string) => {
          switch (env) {
            case 'production':
              return 'error';
            case 'staging':
              return 'warning';
            case 'development':
              return 'info';
            case 'lab':
              return 'secondary';
            default:
              return 'default';
          }
        };

        return (
          <Chip
            label={params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
            size="small"
            color={getEnvironmentColor(params.value) as any}
            variant="filled"
          />
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      maxWidth: 120,
      type: 'select',
      editable: true,
      sortable: true,
      filterable: true,
      valueOptions: [
        { value: 'operational', label: 'Operational' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'retired', label: 'Retired' },
        { value: 'faulty', label: 'Faulty' }
      ],
      colorMap: {
        operational: { backgroundColor: '#e8f5e8', color: '#2e7d32' },
        maintenance: { backgroundColor: '#fff3e0', color: '#f57c00' },
        retired: { backgroundColor: '#ffebee', color: '#d32f2f' },
        faulty: { backgroundColor: '#ffebee', color: '#d32f2f' }
      },
      renderCell: (params) => {
        const getStatusColor = (status: string) => {
          switch (status?.toLowerCase()) {
            case 'operational':
              return 'success';
            case 'maintenance':
              return 'warning';
            case 'retired':
              return 'error';
            case 'faulty':
              return 'error';
            default:
              return 'default';
          }
        };

        return (
          <Chip
            label={params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
            size="small"
            color={getStatusColor(params.value) as any}
            variant="filled"
          />
        );
      }
    },
    {
      field: 'manufacturer',
      headerName: 'Manufacturer',
      minWidth: 150,
      type: 'text',
      editable: true,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        return params.value || <Typography color="text.secondary">-</Typography>;
      }
    },
    {
      field: 'model_number',
      headerName: 'Model',
      minWidth: 150,
      type: 'text',
      editable: true,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        return params.value || <Typography color="text.secondary">-</Typography>;
      }
    },
    {
      field: 'id', // This will be replaced by actions
      headerName: 'Actions',
      minWidth: 120,
      maxWidth: 120,
      type: 'actions',
      editable: false,
      sortable: false,
      filterable: false,
      customActions: [
        (params: GridRowParams<IEmisHardware>) => (
          <IconButton key="view" size="small" onClick={() => onView(params.id as string)} color="primary">
            <ViewIcon />
          </IconButton>
        ),
        (params: GridRowParams<IEmisHardware>) => (
          <IconButton key="edit" size="small" onClick={() => onEdit(params.id as string)} color="primary">
            <EditIcon />
          </IconButton>
        ),
        (params: GridRowParams<IEmisHardware>) => (
          <IconButton key="delete" size="small" onClick={() => onDelete(params.id as string)} color="error">
            <DeleteIcon />
          </IconButton>
        )
      ]
    }
  ];
