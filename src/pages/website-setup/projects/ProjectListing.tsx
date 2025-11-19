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
import { Edit, Delete, GitHub, Launch, Person } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useGetProjectsQuery, useDeleteProjectMutation } from './redux/projects.api';
import { IProject } from './redux/types';
import { IListQueryParams } from '@/globals';
import { formatDate } from '@/utils/formatters';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface ProjectListingProps {
  onEdit: (project: IProject) => void;
}

const ProjectListing: React.FC<ProjectListingProps> = ({ onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState<IListQueryParams>({
    search: '',
    paginationModel: { page: 0, pageSize: 25 },
    sortModel: [{ field: 'created_at', sort: 'desc' }],
    filterModel: { items: [] }
  });
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const {
    data: projectsData,
    isLoading,
    error,
    refetch
  } = useGetProjectsQuery({
    ...filters,
    paginationModel: { page, pageSize: rowsPerPage }
  });

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const handleDelete = async (id: string, title: string) => {
    setDeleteProjectId(id);
  };

  const confirmDelete = async () => {
    if (!deleteProjectId) return;

    try {
      await deleteProject(deleteProjectId).unwrap();
      toast.success('Project deleted successfully');
      setDeleteProjectId(null);
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: string, value: any) => {
    if (field === 'search') {
      setFilters((prev) => ({
        ...prev,
        search: value
      }));
    } else {
      // Handle other filter types by updating filterModel
      setFilters((prev) => ({
        ...prev,
        filterModel: {
          items: [{ field, operator: 'equals', value }]
        }
      }));
    }
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

  if (isLoading && !projectsData) {
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
        Failed to load projects data. Please try again.
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
              placeholder="Search projects..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              sx={{ minWidth: 200 }}
            />

            <TextField
              select
              size="small"
              label="Type"
              value={filters.filterModel?.items?.find((item) => item.field === 'project_type')?.value || ''}
              onChange={(e) => handleFilterChange('project_type', e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="final_year">Final Year</MenuItem>
              <MenuItem value="major">Major Project</MenuItem>
              <MenuItem value="minor">Minor Project</MenuItem>
              <MenuItem value="research">Research</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={filters.filterModel?.items?.find((item) => item.field === 'status')?.value || ''}
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

      {/* Projects Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Supervisor</TableCell>
                <TableCell>Team Size</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Links</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectsData?.results?.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {project.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.project_type?.replace('_', ' ')}
                      </Typography>
                      {project.is_featured && <Chip label="Featured" color="warning" size="small" sx={{ ml: 1 }} />}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={project.status?.replace('_', ' ')} color={getStatusColor(project.status || '') as any} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="primary" />
                      <Typography variant="body2">{project.supervisor_name || 'Not assigned'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{project.members?.length || 0} members</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{project.academic_year || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {project.tags?.slice(0, 2).map((tag: { name: string; color: string }, index: number) => (
                        <Chip
                          key={index}
                          label={tag.name}
                          size="small"
                          sx={{
                            bgcolor: tag.color,
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      ))}
                      {(project.tags?.length || 0) > 2 && (
                        <Chip label={`+${(project.tags?.length || 0) - 2}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {project.github_url && (
                        <IconButton size="small" onClick={() => window.open(project.github_url, '_blank')} title="GitHub Repository">
                          <GitHub fontSize="small" />
                        </IconButton>
                      )}
                      {project.demo_url && (
                        <IconButton size="small" onClick={() => window.open(project.demo_url, '_blank')} title="Live Demo">
                          <Launch fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(project.created_at)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => onEdit(project)} title="Edit Project">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(project.id, project.title)} title="Delete Project" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {!projectsData?.results?.length && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No projects found
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
          count={projectsData?.count || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default ProjectListing;
