import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';

// third-party
import { format } from 'date-fns';

// project import
import MainCard from '@/components/cards/MainCard';
import { axiosInstance } from '@/libs/axios';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// types
interface AppointmentDetail {
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
  confirmedBy?: string;
  confirmedAt?: string;
  createdAt: string;
}

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  REJECTED: 'error',
  CANCELLED: 'error',
  COMPLETED: 'primary'
} as const;

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await axiosInstance.get(`/appointments/admin/${id}/`);
      setAppointment(response.data);
      setNewStatus(response.data.status);
      setAdminNotes(response.data.adminNotes || '');
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!appointment) return;

    setUpdateLoading(true);
    try {
      await axiosInstance.patch(`/appointments/admin/${appointment.id}/`, {
        status: newStatus,
        admin_notes: adminNotes
      });

      await fetchAppointment(); // Refresh the appointment
      setStatusDialog(false);
    } catch (error) {
      setError('Network error occurred');
      console.error('Error updating appointment:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <MainCard title="Appointment Details">
        <Typography>Loading appointment details...</Typography>
      </MainCard>
    );
  }

  if (!appointment) {
    return (
      <MainCard title="Appointment Not Found">
        <Alert severity="error">Appointment not found or you don't have permission to view it.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/appointments')} sx={{ mt: 2 }}>
          Back to Appointments
        </Button>
      </MainCard>
    );
  }

  return (
    <>
      <MainCard
        title={`Appointment #${appointment.id}`}
        secondary={
          <Stack direction="row" spacing={2}>
            <Chip label={appointment.statusDisplay} color={statusColors[appointment.status as keyof typeof statusColors]} />
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/appointments')} variant="outlined" size="small">
              Back
            </Button>
          </Stack>
        }
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Applicant Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Applicant Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">{appointment.applicantName}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon fontSize="small" />
                      {appointment.applicantEmail}
                    </Typography>
                  </Box>

                  {appointment.applicantPhone && (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon fontSize="small" />
                        {appointment.applicantPhone}
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Designation
                    </Typography>
                    <Typography variant="body1">{appointment.applicantDesignation}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointment Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  Appointment Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Category
                    </Typography>
                    <Typography variant="body1">{appointment.category.name.replace(/_/g, ' ')}</Typography>
                  </Box>

                  {appointment.department && (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Department
                      </Typography>
                      <Typography variant="body1">{appointment.department.name}</Typography>
                    </Box>
                  )}

                  {appointment.official && (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Meeting With
                      </Typography>
                      <Typography variant="body1">{appointment.official.designationName}</Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Date
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon fontSize="small" />
                      {format(new Date(appointment.appointmentDate), 'EEEE, MMMM dd, yyyy')}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Time
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" />
                      {appointment.appointmentTime}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Purpose and Details */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Purpose and Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Purpose
                    </Typography>
                    <Typography variant="body1">{appointment.purpose}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Details
                    </Typography>
                    <Typography variant="body1">{appointment.details}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Status and Admin Notes */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Status and Management
                  <Button startIcon={<EditIcon />} variant="outlined" size="small" onClick={() => setStatusDialog(true)}>
                    Update Status
                  </Button>
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Current Status
                    </Typography>
                    <Chip
                      label={appointment.statusDisplay}
                      color={statusColors[appointment.status as keyof typeof statusColors]}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>

                  {appointment.adminNotes && (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Admin Notes
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: 'grey.50' }}>
                        <Typography variant="body2">{appointment.adminNotes}</Typography>
                      </Paper>
                    </Box>
                  )}

                  {appointment.confirmedBy && appointment.confirmedAt && (
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Confirmed By
                      </Typography>
                      <Typography variant="body2">
                        {appointment.confirmedBy} on {format(new Date(appointment.confirmedAt), 'PPP p')}
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Submitted
                    </Typography>
                    <Typography variant="body2">{format(new Date(appointment.createdAt), 'PPP p')}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MainCard>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={updateLoading}
            startIcon={newStatus === 'CONFIRMED' ? <CheckCircleIcon /> : newStatus === 'REJECTED' ? <CancelIcon /> : undefined}
          >
            {updateLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
