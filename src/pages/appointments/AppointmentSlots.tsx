import { useState, useEffect } from 'react';

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';

// project import
import MainCard from '@/components/cards/MainCard';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { axiosInstance, baseURL } from '@/libs/axios';

// assets
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

// types
interface AppointmentSlot {
  id: number;
  category: {
    name: string;
    description: string;
  };
  department?: {
    id: number;
    name: string;
    short_name: string;
  };
  official: {
    id: number;
    designation_name: string;
  };
  weekday: number;
  weekday_display: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_active: boolean;
}

interface AppointmentCategory {
  id: number;
  name: string;
  description: string;
  display_name: string;
  priority: number;
  max_appointments_per_day: number;
  is_active: boolean;
  requires_approval: boolean;
  default_duration_minutes: number;
  advance_booking_days: number;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  designation: {
    title: string;
  };
}

interface Department {
  id: number;
  name: string;
  short_name: string;
}

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AppointmentSlots() {
  const { roleType } = useAppSelector(authState);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [categories, setCategories] = useState<AppointmentCategory[]>([]);
  const [officials, setOfficials] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slotDialog, setSlotDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    official: '',
    department: '',
    weekday: '',
    start_time: '',
    end_time: '',
    duration_minutes: '30',
    is_active: true
  });

  // Check permissions - only ADMIN can access appointment slots management
  if (roleType !== 'ADMIN') {
    return (
      <MainCard title="Access Denied">
        <Typography variant="h6" color="error">
          You do not have permission to access this page.
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Only administrators can manage appointment time slots.
        </Typography>
      </MainCard>
    );
  }

  useEffect(() => {
    fetchSlots();
    fetchCategories();
    fetchOfficials();
    fetchDepartments();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await axiosInstance.get('/appointments/public/slots/');
      setSlots(response.data);
    } catch (error) {
      setError('Failed to fetch appointment slots');
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/appointments/public/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchOfficials = async () => {
    try {
      // This should be replaced with proper user endpoint
      const response = await axiosInstance.get('/cms/users/');
      setOfficials(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching officials:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get('/appointments/public/departments/');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleCreateSlot = () => {
    setSelectedSlot(null);
    setFormData({
      category: '',
      official: '',
      department: '',
      weekday: '',
      start_time: '',
      end_time: '',
      duration_minutes: '30',
      is_active: true
    });
    setSlotDialog(true);
  };

  const handleEditSlot = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
    setFormData({
      category: slot.category.name,
      official: slot.official.id.toString(),
      department: slot.department?.id.toString() || '',
      weekday: slot.weekday.toString(),
      start_time: slot.start_time,
      end_time: slot.end_time,
      duration_minutes: slot.duration_minutes.toString(),
      is_active: slot.is_active
    });
    setSlotDialog(true);
  };

  const handleSaveSlot = async () => {
    try {
      const data = {
        ...formData,
        category: parseInt(formData.category),
        official: parseInt(formData.official),
        department: formData.department ? parseInt(formData.department) : null,
        weekday: parseInt(formData.weekday),
        duration_minutes: parseInt(formData.duration_minutes)
      };

      if (selectedSlot) {
        await axiosInstance.patch(`/appointments/admin/slots/${selectedSlot.id}/`, data);
      } else {
        await axiosInstance.post('/appointments/admin/slots/', data);
      }

      await fetchSlots();
      setSlotDialog(false);
    } catch (error) {
      setError('Network error occurred');
      console.error('Error saving slot:', error);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;

    try {
      await axiosInstance.delete(`/appointments/admin/slots/${slotId}/`);
      await fetchSlots();
    } catch (error) {
      setError('Failed to delete appointment slot');
      console.error('Error deleting slot:', error);
    }
  };

  if (loading) {
    return (
      <MainCard title="Appointment Slots">
        <Typography>Loading appointment slots...</Typography>
      </MainCard>
    );
  }

  return (
    <>
      <MainCard
        title="Appointment Slot Management"
        secondary={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateSlot}>
            Add New Slot
          </Button>
        }
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Official</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Day & Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slots.map((slot) => (
                <TableRow key={slot.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {slot.category.display_name || slot.category.name.replace(/_/g, ' ')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" />
                        {slot.official.designation_name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    {slot.department ? (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BusinessIcon fontSize="small" />
                        {slot.department.name}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        {slot.weekday_display}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="inherit" />
                        {slot.start_time} - {slot.end_time}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{slot.duration_minutes} mins</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip label={slot.is_active ? 'Active' : 'Inactive'} color={slot.is_active ? 'success' : 'default'} size="small" />
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton color="primary" size="small" onClick={() => handleEditSlot(slot)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton color="error" size="small" onClick={() => handleDeleteSlot(slot.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {slots.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              No appointment slots found
            </Typography>
          </Box>
        )}
      </MainCard>

      {/* Slot Dialog */}
      <Dialog open={slotDialog} onClose={() => setSlotDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedSlot ? 'Edit Appointment Slot' : 'Add New Appointment Slot'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.display_name || category.name.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Official"
                value={formData.official}
                onChange={(e) => setFormData({ ...formData, official: e.target.value })}
                fullWidth
              >
                {officials.map((official) => (
                  <MenuItem key={official.id} value={official.id}>
                    {official.first_name} {official.last_name} ({official.designation?.title || 'No designation'})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Department (Optional)"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Weekday"
                value={formData.weekday}
                onChange={(e) => setFormData({ ...formData, weekday: e.target.value })}
                fullWidth
              >
                {weekdays.map((day, index) => (
                  <MenuItem key={index} value={index}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                type="time"
                label="Start Time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                type="time"
                label="End Time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                type="number"
                label="Duration (Minutes)"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                fullWidth
                inputProps={{ min: 15, max: 120, step: 15 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSlotDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSlot} variant="contained">
            {selectedSlot ? 'Update' : 'Create'} Slot
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
