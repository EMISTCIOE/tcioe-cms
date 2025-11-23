import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, FileDownload as FileDownloadIcon, Link as LinkIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import FileUpload from '@/components/FileUpload';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import {
  useCreateEmisDownloadMutation,
  useDeleteEmisDownloadMutation,
  useGetEmisDownloadsQuery,
  useUpdateEmisDownloadMutation
} from '../redux/emis.api';
import { EmisDownloadCategoryOption, IEmisDownload, IEmisDownloadPayload } from '../types';

const categoryLabels: Record<EmisDownloadCategoryOption, string> = {
  report_form: 'Reports & Forms',
  resource: 'Resources'
};

const buildMediaUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = `${import.meta.env.VITE_PUBLIC_APP_HTTP_SCHEME}${import.meta.env.VITE_PUBLIC_APP_BASE_URL}`.replace('/api/', '');
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

const EmisDownloadsPage = () => {
  const { data, isLoading, refetch } = useGetEmisDownloadsQuery();
  const [createDownload, { isLoading: creating }] = useCreateEmisDownloadMutation();
  const [updateDownload, { isLoading: updating }] = useUpdateEmisDownloadMutation();
  const [deleteDownload, { isLoading: deleting }] = useDeleteEmisDownloadMutation();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IEmisDownload | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IEmisDownload | null>(null);

  const form = useForm<IEmisDownloadPayload>({
    defaultValues: {
      title: '',
      description: '',
      category: 'report_form',
      link_url: '',
      file: null
    }
  });

  const handleOpen = (item?: IEmisDownload) => {
    setEditingItem(item || null);
    if (item) {
      form.reset({
        title: item.title,
        description: item.description || '',
        category: item.category,
        link_url: item.link_url || '',
        file: null
      });
    } else {
      form.reset({
        title: '',
        description: '',
        category: 'report_form',
        link_url: '',
        file: null
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (values: IEmisDownloadPayload) => {
    if (!values.file && !values.link_url && !editingItem?.file && !editingItem?.link_url) {
      enqueueSnackbar('Please provide a file or an external link.', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    if (values.description) formData.append('description', values.description);
    formData.append('category', values.category);
    if (values.link_url) formData.append('link_url', values.link_url);
    if (values.file) formData.append('file', values.file);

    try {
      if (editingItem) {
        await updateDownload({ id: editingItem.id, data: formData }).unwrap();
        dispatch(setMessage({ message: 'Download updated successfully', type: 'success' }));
      } else {
        await createDownload(formData).unwrap();
        dispatch(setMessage({ message: 'Download created successfully', type: 'success' }));
      }
      setDialogOpen(false);
      form.reset();
      refetch();
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message || 'Unable to save download';
      enqueueSnackbar(detail, { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDownload(deleteTarget.id).unwrap();
      dispatch(setMessage({ message: 'Download deleted', type: 'success' }));
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message || 'Unable to delete download';
      enqueueSnackbar(detail, { variant: 'error' });
    }
  };

  const downloads = useMemo(() => data?.results || [], [data?.results]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">EMIS Downloads</Typography>
          <Typography variant="body2" color="text.secondary">
            Forms, reports, and resources used by the EMIS team.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add download
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {isLoading && (
          <Grid item xs={12}>
            <Card>
              <CardContent>Loading downloads...</CardContent>
            </Card>
          </Grid>
        )}

        {!isLoading && downloads.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>No downloads yet. Add your first file or link.</CardContent>
            </Card>
          </Grid>
        )}

        {downloads.map((item) => {
          const link = buildMediaUrl(item.link_url || item.file);
          return (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6">{item.title}</Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleOpen(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(item)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {categoryLabels[item.category]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {item.description || 'No description provided.'}
                  </Typography>
                  {link && (
                    <Button
                      startIcon={item.link_url ? <LinkIcon /> : <FileDownloadIcon />}
                      component="a"
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingItem ? 'Edit download' : 'Add download'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Controller
              name="title"
              control={form.control}
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState }) => (
                <TextField {...field} label="Title" error={!!fieldState.error} helperText={fieldState.error?.message} />
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <TextField {...field} label="Description" multiline minRows={2} placeholder="What is this file for?" />
              )}
            />
            <Controller
              name="category"
              control={form.control}
              render={({ field }) => (
                <TextField select label="Category" {...field}>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="link_url"
              control={form.control}
              render={({ field }) => (
                <TextField {...field} label="External link" placeholder="https://example.com/file.pdf" />
              )}
            />
            <Controller
              name="file"
              control={form.control}
              render={({ field }) => (
                <FileUpload
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  value={field.value as File | null}
                  onChange={(f) => field.onChange(f)}
                  label="Upload file (optional if link is provided)"
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            variant="contained"
            disabled={creating || updating}
          >
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete download"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isSubmitting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default EmisDownloadsPage;
