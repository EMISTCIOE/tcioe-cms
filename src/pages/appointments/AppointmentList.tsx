import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

// third-party
import { format } from 'date-fns';

// project import
import MainCard from '@/components/cards/MainCard';
import Avatar from '@/components/@extended/Avatar';
import { PopupTransition } from '@/components/@extended/Transitions';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { axiosInstance } from '@/libs/axios';

// assets
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import FilterListIcon from '@mui/icons-material/FilterList';
import TodayIcon from '@mui/icons-material/Today';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import RefreshIcon from '@mui/icons-material/Refresh';

// types
interface Appointment {
  id: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantDesignation: string;
  category: {
    name: string;
    description: string;
  };
  department?: {
    name: string;
    shortName: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  purpose: string;
  details: string;
  status: string;
  statusDisplay: string;
  adminNotes: string;
  emailVerified: boolean;
  official?: {
    designationName: string;
  };
  createdAt: string;
}

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  REJECTED: 'error',
  CANCELLED: 'error',
  COMPLETED: 'primary'
} as const;

const statusIcons = {
  PENDING: <PendingIcon />,
  CONFIRMED: <CheckCircleIcon />,
  REJECTED: <CancelIcon />,
  CANCELLED: <CancelIcon />,
  COMPLETED: <CheckCircleIcon />
};

export default function AppointmentList() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { roleType, departmentId } = useAppSelector(authState);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('pending'); // Default to pending
  const [concurrentUpdateDialog, setConcurrentUpdateDialog] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [roleType]);

  useEffect(() => {
    applyFilter(currentFilter);
  }, [appointments, currentFilter]);

  const applyFilter = (filter: string) => {
    let filtered = [...appointments];
    const today = format(new Date(), 'yyyy-MM-dd');

    switch (filter) {
      case 'pending':
        filtered = appointments.filter((app) => app.status === 'PENDING');
        break;
      case 'todayPending':
        filtered = appointments.filter((app) => app.status === 'PENDING' && format(new Date(app.appointmentDate), 'yyyy-MM-dd') === today);
        break;
      case 'approved':
        filtered = appointments.filter((app) => app.status === 'CONFIRMED' || app.status === 'COMPLETED');
        break;
      case 'all':
      default:
        filtered = appointments;
        break;
    }

    setFilteredAppointments(filtered);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  const fetchAppointments = async () => {
    try {
      // Build URL with role-based filtering
      let url = '/appointments/admin/list/';
      const params = new URLSearchParams();

      // No additional filtering needed - backend handles role-based filtering automatically
      // based on user's role and designation

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axiosInstance.get(url);
      setAppointments(response.data.results || response.data);
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusUpdate = async () => {
    if (!selectedAppointment) return;

    setUpdateLoading(true);
    try {
      // Check for concurrent updates first
      const checkResponse = await axiosInstance.get(`/appointments/admin/${selectedAppointment.id}/`);

      if (checkResponse.data.status !== selectedAppointment.status) {
        setConcurrentUpdateDialog(true);
        setUpdateLoading(false);
        return;
      }

      await axiosInstance.patch(`/appointments/admin/${selectedAppointment.id}/`, {
        status: newStatus,
        admin_notes: adminNotes
      });

      await fetchAppointments(); // Refresh the list
      setStatusDialog(false);
      setSelectedAppointment(null);
      setNewStatus('');
      setAdminNotes('');
    } catch (error) {
      setError('Network error occurred');
      console.error('Error updating appointment:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleViewAppointment = (appointment: Appointment) => {
    navigate(`/appointments/${appointment.id}`);
  };

  const handleUpdateStatus = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setAdminNotes(appointment.adminNotes || '');
    setStatusDialog(true);
  };

  const pendingCount = useMemo(() => appointments.filter((app) => app.status === 'PENDING').length, [appointments]);

  const todayPendingCount = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return appointments.filter((app) => app.status === 'PENDING' && format(new Date(app.appointmentDate), 'yyyy-MM-dd') === today).length;
  }, [appointments]);

  const confirmedCount = useMemo(
    () => appointments.filter((app) => app.status === 'CONFIRMED' || app.status === 'COMPLETED').length,
    [appointments]
  );

  if (loading) {
    return (
      <MainCard title="Appointments">
        <Typography>Loading appointments...</Typography>
      </MainCard>
    );
  }

  // Get appropriate title and info message based on role
  const getPageTitle = () => {
    if (roleType === 'ADMIN') return 'Appointment Management - All Appointments';
    if (roleType === 'DEPARTMENT-ADMIN') return 'My Department Appointments';
    if (roleType === 'CAMPUS-ADMIN' || roleType === 'CAMPUS-UNIT' || roleType === 'CAMPUS-SECTION') return 'My Appointments';
    return 'My Appointments';
  };

  const getInfoMessage = () => {
    if (roleType === 'ADMIN') return null;
    if (roleType === 'DEPARTMENT-ADMIN') {
      return 'You can only view and manage appointments related to your department.';
    }
    if (roleType === 'CAMPUS-ADMIN' || roleType === 'CAMPUS-UNIT' || roleType === 'CAMPUS-SECTION') {
      return 'You can only view and manage appointments made with you based on your role and designation.';
    }
    return 'You can only view and manage your own appointments.';
  };

  return (
    <>
      <MainCard
        title={getPageTitle()}
        secondary={
          <Stack direction="row" spacing={2} alignItems="center">
            <ButtonGroup variant="outlined" size="small">
              <Button
                variant={currentFilter === 'pending' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('pending')}
                startIcon={<PendingIcon />}
                color={currentFilter === 'pending' ? 'primary' : 'inherit'}
              >
                Pending ({pendingCount})
              </Button>
              <Button
                variant={currentFilter === 'todayPending' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('todayPending')}
                startIcon={<TodayIcon />}
                color={currentFilter === 'todayPending' ? 'warning' : 'inherit'}
              >
                Today's Pending ({todayPendingCount})
              </Button>
              <Button
                variant={currentFilter === 'approved' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('approved')}
                startIcon={<CheckCircleIcon />}
                color={currentFilter === 'approved' ? 'success' : 'inherit'}
              >
                Approved ({confirmedCount})
              </Button>
              <Button
                variant={currentFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('all')}
                startIcon={<AllInclusiveIcon />}
                color={currentFilter === 'all' ? 'secondary' : 'inherit'}
              >
                All ({appointments.length})
              </Button>
            </ButtonGroup>
            <IconButton onClick={() => fetchAppointments()} color="primary">
              <RefreshIcon />
            </IconButton>
          </Stack>
        }
      >
        {getInfoMessage() && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {getInfoMessage()}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      {appointments.length === 0 ? 'No appointments found.' : `No appointments match the current filter: ${currentFilter}.`}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ color: 'secondary.main' }}>
                          <PersonIcon />
                        </Avatar>
                        <Stack spacing={0}>
                          <Typography variant="subtitle2">{appointment.applicantName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {appointment.applicantDesignation}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon fontSize="inherit" />
                            {appointment.applicantEmail}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight="medium">
                          {appointment.category.name.replace(/_/g, ' ')}
                        </Typography>
                        {appointment.department && (
                          <Typography variant="caption" color="textSecondary">
                            {appointment.department.name}
                          </Typography>
                        )}
                        {appointment.official && (
                          <Typography variant="caption" color="textSecondary">
                            {appointment.official.designationName}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayIcon fontSize="small" />
                          {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {appointment.appointmentTime}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {appointment.purpose}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={statusIcons[appointment.status as keyof typeof statusIcons]}
                        label={appointment.statusDisplay}
                        color={statusColors[appointment.status as keyof typeof statusColors]}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton color="primary" size="small" onClick={() => handleViewAppointment(appointment)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        {appointment.status === 'PENDING' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                color="success"
                                size="small"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setNewStatus('CONFIRMED');
                                  setAdminNotes('');
                                  setStatusDialog(true);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Reject">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setNewStatus('REJECTED');
                                  setAdminNotes('');
                                  setStatusDialog(true);
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {/* Concurrent Update Dialog */}
      <Dialog
        open={concurrentUpdateDialog}
        onClose={() => setConcurrentUpdateDialog(false)}
        TransitionComponent={PopupTransition}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Concurrent Update Detected
          </Alert>
        </DialogTitle>
        <DialogContent>
          <Typography>
            This appointment has been updated by another user while you were making changes. Please refresh the page to see the latest
            status before making any updates.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConcurrentUpdateDialog(false);
              fetchAppointments(); // Refresh data
            }}
            color="primary"
            variant="contained"
          >
            Refresh Data
          </Button>
          <Button onClick={() => setConcurrentUpdateDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} TransitionComponent={PopupTransition} maxWidth="sm" fullWidth>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField select label="Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} fullWidth>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </TextField>

            <TextField
              label="Admin Notes"
              multiline
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this status update..."
              fullWidth
            />

            {selectedAppointment && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Appointment Details:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedAppointment.applicantName} - {selectedAppointment.purpose}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained" disabled={updateLoading}>
            {updateLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
