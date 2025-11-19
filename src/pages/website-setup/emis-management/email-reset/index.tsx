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
import {
  useGetEmailResetRequestsQuery,
  useApproveEmailResetRequestMutation,
  useRejectEmailResetRequestMutation,
  useResetEmailRequestLimitMutation
} from '../redux/emis.api';
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

  // Helper function to safely format dates
  const safeFormatDate = (dateValue: string | null | undefined, formatString: string = 'MMM dd, yyyy') => {
    if (!dateValue) return 'N/A';
    try {
      return format(new Date(dateValue), formatString);
    } catch (error) {
      console.error('Invalid date value:', dateValue, error);
      return 'Invalid Date';
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatusType>('pending');
  const [tabValue, setTabValue] = useState(0);
  const [viewDialog, setViewDialog] = useState<IEmailResetRequest | null>(null);
  const [processDialog, setProcessDialog] = useState<{ request: IEmailResetRequest; action: 'approve' | 'reject' } | null>(null);
  const [resetLimitDialog, setResetLimitDialog] = useState<IEmailResetRequest | null>(null);

  const { data: requestsData, isLoading, refetch } = useGetEmailResetRequestsQuery();
  const [approveRequest, { isLoading: approveLoading }] = useApproveEmailResetRequestMutation();
  const [rejectRequest, { isLoading: rejectLoading }] = useRejectEmailResetRequestMutation();
  const [resetRequestLimit, { isLoading: resetLimitLoading }] = useResetEmailRequestLimitMutation();

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

  const handleResetRequestLimit = async () => {
    if (!resetLimitDialog) return;

    try {
      const response = await resetRequestLimit({ email: resetLimitDialog.primaryEmail }).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      setResetLimitDialog(null);
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || 'Failed to reset request limit', { variant: 'error' });
    }
  };

  const filteredRequests =
    requestsData?.results?.filter((request) => {
      const matchesSearch =
        (request.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (request.rollNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (request.primaryEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (request.phoneNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase());

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
              {request.fullName}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Roll:</strong> {request.rollNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Sequence:</strong> #{request.requestSequence}
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
              <Typography variant="body2">{request.primaryEmail}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">{request.phoneNumber}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2">DOB: {safeFormatDate(request.birthDate, 'MMM dd, yyyy')}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">{safeFormatDate(request.createdAt, 'MMM dd, yyyy HH:mm')}</Typography>
            </Stack>
          </Grid>
        </Grid>

        {request.processedAt && (
          <Alert severity={request.status === 'approved' ? 'success' : 'error'} sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>{request.status === 'approved' ? 'Approved' : 'Rejected'}</strong> by {request.processedByName}
              on {safeFormatDate(request.processedAt, 'MMM dd, yyyy HH:mm')}
            </Typography>
            {request.notes && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Notes:</strong> {request.notes}
              </Typography>
            )}
          </Alert>
        )}

        {/* Request Limit Information */}
        {request.requestsRemaining < 10 && (
          <Alert
            severity={request.requestsRemaining <= 2 ? 'error' : 'warning'}
            sx={{ mb: 2 }}
            action={
              request.requestsRemaining === 0 ? (
                <Button color="inherit" size="small" onClick={() => setResetLimitDialog(request)}>
                  Reset Limit
                </Button>
              ) : null
            }
          >
            <Typography variant="body2">
              <strong>Requests Remaining:</strong> {request.requestsRemaining}/10
              {request.requestsRemaining === 0 && ' - This user cannot make more requests until limit is reset'}
            </Typography>
          </Alert>
        )}

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" startIcon={<ViewIcon />} onClick={() => setViewDialog(request)}>
            View Details
          </Button>
          {request.requestsRemaining === 0 && (
            <Button size="small" variant="outlined" color="warning" onClick={() => setResetLimitDialog(request)}>
              Reset Limit ({request.requestsRemaining}/10)
            </Button>
          )}
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
                  <Typography variant="subtitle2">{request.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.rollNumber} • Sequence #{request.requestSequence}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{request.primaryEmail}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {request.phoneNumber}
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
                <Typography variant="body2">{safeFormatDate(request.createdAt, 'MMM dd, yyyy')}</Typography>
                {request.processedAt && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Processed: {safeFormatDate(request.processedAt, 'MMM dd, yyyy')}
                  </Typography>
                )}
                <Typography variant="caption" display="block" color={request.requestsRemaining === 0 ? 'error.main' : 'text.secondary'}>
                  Requests: {request.requestsRemaining}/10
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton size="small" onClick={() => setViewDialog(request)} color="primary">
                    <ViewIcon />
                  </IconButton>
                  {request.requestsRemaining === 0 && (
                    <IconButton size="small" onClick={() => setResetLimitDialog(request)} color="warning" title="Reset Request Limit">
                      <AssignmentIcon />
                    </IconButton>
                  )}
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
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select value={statusFilter} label="Status Filter" onChange={(e) => setStatusFilter(e.target.value as any)}>
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending Only</MenuItem>
                  <MenuItem value="approved">Approved Only</MenuItem>
                  <MenuItem value="rejected">Rejected Only</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant={statusFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('all')}
                sx={{ minWidth: 80 }}
              >
                Show All
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              cursor: 'pointer',
              bgcolor: statusFilter === 'pending' ? 'warning.lighter' : 'inherit',
              border: statusFilter === 'pending' ? '2px solid' : '1px solid',
              borderColor: statusFilter === 'pending' ? 'warning.main' : 'divider',
              '&:hover': { bgcolor: 'warning.lighter' }
            }}
            onClick={() => setStatusFilter('pending')}
          >
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
          <Card
            sx={{
              cursor: 'pointer',
              bgcolor: statusFilter === 'approved' ? 'success.lighter' : 'inherit',
              border: statusFilter === 'approved' ? '2px solid' : '1px solid',
              borderColor: statusFilter === 'approved' ? 'success.main' : 'divider',
              '&:hover': { bgcolor: 'success.lighter' }
            }}
            onClick={() => setStatusFilter('approved')}
          >
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
          <Card
            sx={{
              cursor: 'pointer',
              bgcolor: statusFilter === 'rejected' ? 'error.lighter' : 'inherit',
              border: statusFilter === 'rejected' ? '2px solid' : '1px solid',
              borderColor: statusFilter === 'rejected' ? 'error.main' : 'divider',
              '&:hover': { bgcolor: 'error.lighter' }
            }}
            onClick={() => setStatusFilter('rejected')}
          >
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
                  <Typography variant="body1">{viewDialog.fullName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Roll Number
                  </Typography>
                  <Typography variant="body1">{viewDialog.rollNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">{safeFormatDate(viewDialog.birthDate, 'MMMM dd, yyyy')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">{viewDialog.phoneNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Primary Email
                  </Typography>
                  <Typography variant="body1">{viewDialog.primaryEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Secondary Email
                  </Typography>
                  <Typography variant="body1">{viewDialog.secondaryEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Request Sequence
                  </Typography>
                  <Typography variant="body1">#{viewDialog.requestSequence}</Typography>
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Requests Remaining
                  </Typography>
                  <Typography variant="body1" color={viewDialog.requestsRemaining === 0 ? 'error.main' : 'text.primary'}>
                    {viewDialog.requestsRemaining}/10
                    {viewDialog.requestsRemaining === 0 && ' (Limit Reached)'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Request Date
                </Typography>
                <Typography variant="body1">{safeFormatDate(viewDialog.createdAt, 'MMMM dd, yyyy HH:mm:ss')}</Typography>
              </Box>

              {viewDialog.processedAt && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Processing Information
                  </Typography>
                  <Typography variant="body1">
                    <strong>Processed by:</strong> {viewDialog.processedByName || 'Unknown'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Processed at:</strong> {safeFormatDate(viewDialog.processedAt, 'MMMM dd, yyyy HH:mm:ss')}
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
          {viewDialog && viewDialog.requestsRemaining === 0 && (
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                setResetLimitDialog(viewDialog);
                setViewDialog(null);
              }}
            >
              Reset Limit
            </Button>
          )}
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
                    <strong>{processDialog.request.fullName}</strong> ({processDialog.request.rollNumber}).
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

      {/* Reset Request Limit Confirmation Dialog */}
      <Dialog open={!!resetLimitDialog} onClose={() => setResetLimitDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Reset Request Limit</DialogTitle>
        <DialogContent>
          {resetLimitDialog && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Alert severity="warning">
                <Typography variant="body2">
                  You are about to reset the email request limit for <strong>{resetLimitDialog.fullName}</strong> (
                  {resetLimitDialog.primaryEmail}).
                </Typography>
              </Alert>
              <Typography variant="body2">
                Current status: <strong>{resetLimitDialog.requestsRemaining}/10 requests remaining</strong>
              </Typography>
              <Typography variant="body2">
                After reset, this user will be able to make <strong>10 new email reset requests</strong>.
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetLimitDialog(null)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleResetRequestLimit} disabled={resetLimitLoading}>
            {resetLimitLoading ? 'Resetting...' : 'Reset Limit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailResetManagement;
