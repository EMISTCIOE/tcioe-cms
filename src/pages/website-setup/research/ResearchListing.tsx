import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { Edit, Delete, AttachMoney, Group } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useGetResearchQuery, useDeleteResearchMutation } from './redux/research.api';
import { IResearch, IResearchFilters } from './redux/types';
import { formatDate } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface ResearchListingProps {
  onEdit: (research: IResearch) => void;
}

const ResearchListing: React.FC<ResearchListingProps> = ({ onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState<IResearchFilters>({
    page: 1,
    page_size: 25,
    ordering: '-created_at'
  });
  const [deleteResearchId, setDeleteResearchId] = useState<string | null>(null);

  const {
    data: researchData,
    isLoading,
    error,
    refetch
  } = useGetResearchQuery({
    ...filters,
    page: page + 1,
    page_size: rowsPerPage
  });

  const [deleteResearch, { isLoading: isDeleting }] = useDeleteResearchMutation();

  const handleDelete = async (id: string, title: string) => {
    setDeleteResearchId(id);
  };

  const confirmDelete = async () => {
    if (!deleteResearchId) return;

    try {
      await deleteResearch(deleteResearchId).unwrap();
      toast.success('Research deleted successfully');
      setDeleteResearchId(null);
    } catch (error) {
      toast.error('Failed to delete research');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof IResearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'draft':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading && !researchData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        Failed to load research data. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters & Search
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search research..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              sx={{ minWidth: 200 }}
            />

            <TextField
              select
              size="small"
              label="Type"
              value={filters.research_type || ''}
              onChange={(e) => handleFilterChange('research_type', e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="basic">Basic Research</MenuItem>
              <MenuItem value="applied">Applied Research</MenuItem>
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="collaborative">Collaborative</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Research Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Research Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>PI/Investigators</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Funding</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Publications</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {researchData?.results?.map((research) => (
                <TableRow key={research.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {research.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {research.research_type?.replace('_', ' ')}
                      </Typography>
                      {research.is_featured && <Chip label="Featured" color="warning" size="small" sx={{ ml: 1 }} />}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={research.status?.replace('_', ' ')} color={getStatusColor(research.status || '') as any} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{research.principal_investigator || 'Not assigned'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Group fontSize="small" color="primary" />
                      <Typography variant="body2">{research.participants?.length || 0} participants</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {research.funding_amount && (
                        <>
                          <AttachMoney fontSize="small" color="success" />
                          <Typography variant="body2">₹{research.funding_amount?.toLocaleString()}</Typography>
                        </>
                      )}
                      {!research.funding_amount && (
                        <Typography variant="body2" color="text.secondary">
                          Not funded
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {research.start_date && research.end_date
                        ? `${formatDate(research.start_date)} - ${formatDate(research.end_date)}`
                        : 'Not specified'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{research.publications?.length || 0} publications</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(research.created_at)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => onEdit(research)} title="Edit Research">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(research.id, research.title)}
                        title="Delete Research"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {!researchData?.results?.length && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No research found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={researchData?.count || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteResearchId}
        onClose={() => setDeleteResearchId(null)}
        onConfirm={confirmDelete}
        title="Delete Research"
        message="Are you sure you want to delete this research? This action cannot be undone."
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default ResearchListing;
