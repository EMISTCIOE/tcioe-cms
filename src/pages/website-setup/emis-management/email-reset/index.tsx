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
  Avatar,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useGetEmailResetRequestsQuery, useApproveEmailResetRequestMutation, useRejectEmailResetRequestMutation } from '../redux/emis.api';
import { IEmailResetRequest, RequestStatusType } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface ProcessRequestFormData {
  notes: string;
}

const EmailResetManagement = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatusType>('all');
  const [tabValue, setTabValue] = useState(0);
  const [viewDialog, setViewDialog] = useState<IEmailResetRequest | null>(null);
  const [processDialog, setProcessDialog] = useState<{ request: IEmailResetRequest; action: 'approve' | 'reject' } | null>(null);

  const { data: requestsData, isLoading, refetch } = useGetEmailResetRequestsQuery();
  const [approveRequest, { isLoading: approveLoading }] = useApproveEmailResetRequestMutation();
  const [rejectRequest, { isLoading: rejectLoading }] = useRejectEmailResetRequestMutation();

  const processForm = useForm<ProcessRequestFormData>({
    defaultValues: {
      notes: ''
    }
  });

  const handleProcessRequest = async (values: ProcessRequestFormData) => {
    if (!processDialog) return;

    try {
      const { request, action } = processDialog;
      const response =
        action === 'approve'
          ? await approveRequest({ id: request.id, data: values }).unwrap()
          : await rejectRequest({ id: request.id, data: values }).unwrap();

      dispatch(setMessage({ message: response.message, variant: 'success' }));
      setProcessDialog(null);
      processForm.reset();
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || `Failed to ${processDialog.action} request`, { variant: 'error' });
    }
  };

  const filteredRequests =
    requestsData?.results?.filter((request) => {
      const matchesSearch =
        request.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.primary_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.phone_number.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  const getStatusColor = (status: RequestStatusType) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: RequestStatusType) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon />;
      case 'rejected':
        return <CancelIcon />;
      default:
        return <AccessTimeIcon />;
    }
  };

  const groupedRequests = {
    pending: filteredRequests.filter((r) => r.status === 'pending'),
    approved: filteredRequests.filter((r) => r.status === 'approved'),
    rejected: filteredRequests.filter((r) => r.status === 'rejected')
  };

  const RequestCard = ({ request }: { request: IEmailResetRequest }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {request.full_name}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Roll:</strong> {request.roll_number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Sequence:</strong> #{request.request_sequence}
              </Typography>
            </Stack>
          </Box>
          <Chip
            icon={getStatusIcon(request.status)}
            label={request.status.toUpperCase()}
            color={getStatusColor(request.status)}
            variant="outlined"
          />
        </Stack>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2">{request.primary_email}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">{request.phone_number}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2">DOB: {format(new Date(request.birth_date), 'MMM dd, yyyy')}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">{format(new Date(request.created_at), 'MMM dd, yyyy HH:mm')}</Typography>
            </Stack>
          </Grid>
        </Grid>

        {request.processed_at && (
          <Alert severity={request.status === 'approved' ? 'success' : 'error'} sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>{request.status === 'approved' ? 'Approved' : 'Rejected'}</strong> by {request.processed_by_name}
              on {format(new Date(request.processed_at), 'MMM dd, yyyy HH:mm')}
            </Typography>
            {request.notes && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Notes:</strong> {request.notes}
              </Typography>
            )}
          </Alert>
        )}

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" startIcon={<ViewIcon />} onClick={() => setViewDialog(request)}>
            View Details
          </Button>
          {request.status === 'pending' && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => setProcessDialog({ request, action: 'approve' })}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setProcessDialog({ request, action: 'reject' })}
              >
                Reject
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  const RequestTable = ({ requests }: { requests: IEmailResetRequest[] }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student Info</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2">{request.full_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.roll_number} • Sequence #{request.request_sequence}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{request.primary_email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.phone_number}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  icon={getStatusIcon(request.status)}
                  label={request.status.toUpperCase()}
                  color={getStatusColor(request.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{format(new Date(request.created_at), 'MMM dd, yyyy')}</Typography>
                {request.processed_at && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Processed: {format(new Date(request.processed_at), 'MMM dd, yyyy')}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton size="small" onClick={() => setViewDialog(request)} color="primary">
                    <ViewIcon />
                  </IconButton>
                  {request.status === 'pending' && (
                    <>
                      <IconButton size="small" onClick={() => setProcessDialog({ request, action: 'approve' })} color="success">
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => setProcessDialog({ request, action: 'reject' })} color="error">
                        <CancelIcon />
                      </IconButton>
                    </>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Email Reset Requests
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by name, roll number, email, or phone..."
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
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select value={statusFilter} label="Status Filter" onChange={(e) => setStatusFilter(e.target.value as any)}>
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <AccessTimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{groupedRequests.pending.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Requests
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{groupedRequests.approved.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <CancelIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{groupedRequests.rejected.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rejected
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* View Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Card View" />
          <Tab label="Table View" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {filteredRequests.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No email reset requests found
            </Typography>
          </Paper>
        ) : (
          filteredRequests.map((request) => <RequestCard key={request.id} request={request} />)
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {filteredRequests.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No email reset requests found
            </Typography>
          </Paper>
        ) : (
          <RequestTable requests={filteredRequests} />
        )}
      </TabPanel>

      {/* View Details Dialog */}
      <Dialog open={!!viewDialog} onClose={() => setViewDialog(null)} maxWidth="md" fullWidth>
        <DialogTitle>Email Reset Request Details</DialogTitle>
        <DialogContent>
          {viewDialog && (
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">{viewDialog.full_name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Roll Number
                  </Typography>
                  <Typography variant="body1">{viewDialog.roll_number}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">{format(new Date(viewDialog.birth_date), 'MMMM dd, yyyy')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">{viewDialog.phone_number}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Primary Email
                  </Typography>
                  <Typography variant="body1">{viewDialog.primary_email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Secondary Email
                  </Typography>
                  <Typography variant="body1">{viewDialog.secondary_email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Request Sequence
                  </Typography>
                  <Typography variant="body1">#{viewDialog.request_sequence}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(viewDialog.status)}
                    label={viewDialog.status.toUpperCase()}
                    color={getStatusColor(viewDialog.status)}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Request Date
                </Typography>
                <Typography variant="body1">{format(new Date(viewDialog.created_at), 'MMMM dd, yyyy HH:mm:ss')}</Typography>
              </Box>

              {viewDialog.processed_at && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Processing Information
                  </Typography>
                  <Typography variant="body1">
                    <strong>Processed by:</strong> {viewDialog.processed_by_name || 'Unknown'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Processed at:</strong> {format(new Date(viewDialog.processed_at), 'MMMM dd, yyyy HH:mm:ss')}
                  </Typography>
                  {viewDialog.notes && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Notes:</strong> {viewDialog.notes}
                    </Typography>
                  )}
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Process Request Dialog */}
      <Dialog open={!!processDialog} onClose={() => setProcessDialog(null)} maxWidth="sm" fullWidth>
        <form onSubmit={processForm.handleSubmit(handleProcessRequest)}>
          <DialogTitle>{processDialog?.action === 'approve' ? 'Approve' : 'Reject'} Request</DialogTitle>
          <DialogContent>
            {processDialog && (
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Alert severity={processDialog.action === 'approve' ? 'success' : 'warning'}>
                  <Typography variant="body2">
                    You are about to <strong>{processDialog.action}</strong> the email reset request for{' '}
                    <strong>{processDialog.request.full_name}</strong> ({processDialog.request.roll_number}).
                  </Typography>
                </Alert>

                <Controller
                  name="notes"
                  control={processForm.control}
                  render={({ field }) => (
                    <TextField
                      label={`${processDialog.action === 'approve' ? 'Approval' : 'Rejection'} Notes`}
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Add any notes about this decision..."
                      {...field}
                    />
                  )}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProcessDialog(null)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color={processDialog?.action === 'approve' ? 'success' : 'error'}
              disabled={approveLoading || rejectLoading}
            >
              {processDialog?.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EmailResetManagement;
