import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useDeleteSubjectMutation, useGetSubjectsQuery } from './redux/academic.api';
import { ISubject, PROGRAM_OPTIONS } from './types';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface SubjectsListingProps {
  onEdit: (subject: ISubject) => void;
}

export const SubjectsListing: React.FC<SubjectsListingProps> = ({ onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useGetSubjectsQuery({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    search: searchTerm || undefined,
    program: programFilter || undefined
  });

  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  const subjects = data?.results ?? [];

  const handleDelete = (subjectId: string) => setDeleteSubjectId(subjectId);

  const confirmDelete = async () => {
    if (!deleteSubjectId) return;
    try {
      await deleteSubject(deleteSubjectId).unwrap();
      toast.success('Subject deleted successfully.');
    } catch {
      toast.error('Unable to delete subject.');
    } finally {
      setDeleteSubjectId(null);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleProgramFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgramFilter(event.target.value);
    setPage(0);
  };

  if (isLoading && !data) {
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
          <Button color="inherit" size="small" onClick={refetch}>
            Retry
          </Button>
        }
      >
        Unable to load subjects.
      </Alert>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Search color="action" />
              <TextField size="small" placeholder="Search subjects" value={searchTerm} onChange={handleSearchChange} />
            </Stack>
            <TextField
              size="small"
              select
              label="Filter by Program"
              value={programFilter}
              onChange={handleProgramFilterChange}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Programs</MenuItem>
              {PROGRAM_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Academic Program</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{subject.name}</Typography>
                  </TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{subject.semester}</TableCell>
                  <TableCell>{subject.program}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {subject.academic_program ? subject.academic_program.short_name || subject.academic_program.name : 'Independent'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => onEdit(subject)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(subject.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!subjects.length && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No subjects found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data?.count ?? 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(deleteSubjectId)}
        title="Delete Subject"
        message="Are you sure you want to remove this subject?"
        onClose={() => setDeleteSubjectId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </Box>
  );
};
