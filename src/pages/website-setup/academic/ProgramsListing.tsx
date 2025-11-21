import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Paper,
  Typography,
  Chip
} from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useDeleteAcademicProgramMutation, useGetAcademicProgramsQuery } from './redux/academic.api';
import { IAcademicProgram, ACADEMIC_PROGRAM_TYPE_OPTIONS } from './types';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface ProgramsListingProps {
  onEdit: (program: IAcademicProgram) => void;
}

export const ProgramsListing: React.FC<ProgramsListingProps> = ({ onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteProgramId, setDeleteProgramId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useGetAcademicProgramsQuery({
    limit: rowsPerPage,
    offset: page * rowsPerPage,
    search: searchTerm || undefined
  });

  const [deleteAcademicProgram, { isLoading: isDeleting }] = useDeleteAcademicProgramMutation();

  const handleDelete = (programId: number) => {
    setDeleteProgramId(programId);
  };

  const confirmDelete = async () => {
    if (!deleteProgramId) return;
    try {
      await deleteAcademicProgram(deleteProgramId).unwrap();
      toast.success('Program deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete the program.');
    } finally {
      setDeleteProgramId(null);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const programs = data?.results ?? [];

  const getProgramTypeLabel = (value: string) => ACADEMIC_PROGRAM_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;

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
        Unable to load programs. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Search color="action" />
              <TextField size="small" placeholder="Search programs" value={searchTerm} onChange={handleSearchChange} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Showing {programs.length} of {data?.count ?? 0} programs
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Program</TableCell>
                <TableCell>Short Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id} hover>
                  <TableCell sx={{ minWidth: 220 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">{program.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {program.description}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {program.short_name || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getProgramTypeLabel(program.program_type)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{program.department.short_name || program.department.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={program.is_active ? 'Active' : 'Inactive'}
                      color={program.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => onEdit(program)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(program.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!programs.length && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No programs found.
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
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(deleteProgramId)}
        title="Delete Program"
        message="Are you sure you want to delete this academic program?"
        onClose={() => setDeleteProgramId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </Box>
  );
};
