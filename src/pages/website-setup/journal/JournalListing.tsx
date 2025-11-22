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
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { IListQueryParams } from '@/globals';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { formatDate } from '@/utils/formatters';
import { useGetJournalArticlesQuery, useDeleteJournalArticleMutation } from './redux/journal.api';
import { IJournalArticle } from './redux/types';

interface JournalListingProps {
  onEdit: (article: IJournalArticle) => void;
}

const JournalListing: React.FC<JournalListingProps> = ({ onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState<IListQueryParams>({
    search: '',
    paginationModel: { page: 0, pageSize: 25 },
    sortModel: [{ field: 'date_published', sort: 'desc' }],
    filterModel: { items: [] }
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useGetJournalArticlesQuery({
    ...filters,
    paginationModel: { page, pageSize: rowsPerPage }
  });
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteJournalArticleMutation();

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id: string) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteArticle(deleteId).unwrap();
      toast.success('Article deleted successfully');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete article');
    }
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
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        Failed to load journal articles.
      </Alert>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters & Search
          </Typography>
          <TextField
            size="small"
            placeholder="Search articles..."
            value={filters.search || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value
              }))
            }
            sx={{ minWidth: 240 }}
          />
        </CardContent>
      </Card>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Department / Program</TableCell>
                <TableCell>Published</TableCell>
                <TableCell>DOI</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results?.map((article) => (
                <TableRow key={article.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {article.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {article.url_id}
                    </Typography>
                  </TableCell>
                  <TableCell>{article.genre}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column' }}>
                      {article.department_name && <Chip label={article.department_name} size="small" />}
                      {article.academic_program_name && (
                        <Chip
                          label={article.academic_program_short_name || article.academic_program_name}
                          color="info"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{article.date_published ? formatDate(article.date_published) : '-'}</TableCell>
                  <TableCell>{article.doi_id || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => onEdit(article)} title="Edit">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(article.id)} title="Delete">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {!data?.results?.length && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No articles found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={data?.count || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Article"
        message="Are you sure you want to delete this journal article?"
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default JournalListing;
