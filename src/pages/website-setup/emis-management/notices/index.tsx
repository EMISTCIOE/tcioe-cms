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
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import FileUpload from '@/components/FileUpload';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import {
  useCreateEmisNoticeMutation,
  useDeleteEmisNoticeMutation,
  useGetEmisNoticesQuery,
  useUpdateEmisNoticeMutation
} from '../redux/emis.api';
import { EmisNoticeCategoryOption, EmisNoticeSeverityOption, IEmisNotice, IEmisNoticePayload } from '../types';

type AnyNotice = IEmisNotice & {
  isPublished?: boolean;
  publishedAt?: string;
  attachment?: string | null;
};

const categoryLabels: Record<EmisNoticeCategoryOption, string> = {
  security: 'Security',
  maintenance: 'Maintenance',
  release: 'Release',
  advisory: 'Advisory',
  general: 'General'
};

const severityLabels: Record<EmisNoticeSeverityOption, string> = {
  critical: 'Critical',
  major: 'Major',
  minor: 'Minor',
  info: 'Info'
};

const buildMediaUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = `${import.meta.env.VITE_PUBLIC_APP_HTTP_SCHEME}${import.meta.env.VITE_PUBLIC_APP_BASE_URL}`.replace('/api/', '');
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
};

const formatDateInput = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toIsoString = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return isNaN(date.getTime()) ? '' : date.toISOString();
};

const stripHtml = (value?: string | null) => {
  if (!value) return '';
  return value.replace(/<[^>]+>/g, '').trim();
};

const normalizeNotice = (notice: AnyNotice) => {
  const published_at = notice.published_at || notice.publishedAt || '';
  const is_published = notice.is_published ?? notice.isPublished ?? false;
  const attachment = notice.attachment ?? (notice as any).attachment ?? null;
  return { ...notice, published_at, is_published, attachment };
};

const EmisNoticesPage = () => {
  const { data, isLoading, refetch } = useGetEmisNoticesQuery();
  const [createNotice, { isLoading: creating }] = useCreateEmisNoticeMutation();
  const [updateNotice, { isLoading: updating }] = useUpdateEmisNoticeMutation();
  const [deleteNotice, { isLoading: deleting }] = useDeleteEmisNoticeMutation();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IEmisNotice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IEmisNotice | null>(null);

  const form = useForm<IEmisNoticePayload>({
    defaultValues: {
      title: '',
      summary: '',
      body: '',
      category: 'general',
      severity: 'info',
      published_at: '',
      is_published: true,
      external_url: '',
      attachment: null
    }
  });

  const handleOpen = (item?: IEmisNotice) => {
    const normalized = item ? normalizeNotice(item as AnyNotice) : null;
    setEditingItem((normalized as IEmisNotice) || null);
    if (normalized) {
      form.reset({
        title: normalized.title,
        summary: normalized.summary || '',
        body: stripHtml(normalized.body) || '',
        category: normalized.category,
        severity: normalized.severity,
        published_at: formatDateInput(normalized.published_at),
        is_published: normalized.is_published,
        external_url: normalized.external_url || '',
        attachment: null
      });
    } else {
      form.reset({
        title: '',
        summary: '',
        body: '',
        category: 'general',
        severity: 'info',
        published_at: '',
        is_published: true,
        external_url: '',
        attachment: null
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (values: IEmisNoticePayload) => {
    const formData = new FormData();
    formData.append('title', values.title);
    if (values.summary) formData.append('summary', values.summary);
    if (values.body) formData.append('body', values.body);
    formData.append('category', values.category);
    formData.append('severity', values.severity);
    const publishIso = toIsoString(values.published_at);
    if (publishIso) formData.append('published_at', publishIso);
    formData.append('is_published', `${values.is_published ?? true}`);
    if (values.external_url) formData.append('external_url', values.external_url);
    if (values.attachment) formData.append('attachment', values.attachment);

    try {
      if (editingItem) {
        await updateNotice({ id: editingItem.id, data: formData }).unwrap();
        dispatch(setMessage({ message: 'Notice updated successfully', type: 'success' }));
      } else {
        await createNotice(formData).unwrap();
        dispatch(setMessage({ message: 'Notice created successfully', type: 'success' }));
      }
      setDialogOpen(false);
      await refetch();
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message || 'Unable to save notice';
      enqueueSnackbar(detail, { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNotice(deleteTarget.id).unwrap();
      dispatch(setMessage({ message: 'Notice deleted', type: 'success' }));
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      const detail = err?.data?.detail || err?.data?.message || 'Unable to delete notice';
      enqueueSnackbar(detail, { variant: 'error' });
    }
  };

  const notices = useMemo(() => (data?.results || []).map((n: AnyNotice) => normalizeNotice(n)), [data?.results]);
  const existingAttachmentName = editingItem?.attachment ? editingItem.attachment.split('/').pop() || editingItem.attachment : undefined;
  const existingAttachmentUrl = editingItem?.attachment ? buildMediaUrl(editingItem.attachment) : undefined;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">EMIS Notices</Typography>
          <Typography variant="body2" color="text.secondary">
            Publish EMIS-only advisories, maintenance windows, and security updates.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add notice
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {isLoading && (
          <Grid item xs={12}>
            <Card>
              <CardContent>Loading notices...</CardContent>
            </Card>
          </Grid>
        )}

        {!isLoading && notices.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>No notices have been created yet.</CardContent>
            </Card>
          </Grid>
        )}

        {notices.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {categoryLabels[item.category]} • {severityLabels[item.severity]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Published: {item.published_at ? new Date(item.published_at).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => handleOpen(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(item)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {item.summary || 'No summary provided.'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VisibilityIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {item.is_published ? 'Published' : 'Unpublished'} • {item.views} views
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editingItem ? 'Edit notice' : 'Add notice'}</DialogTitle>
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
              name="summary"
              control={form.control}
              render={({ field }) => <TextField {...field} label="Summary" multiline minRows={2} />}
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
              name="severity"
              control={form.control}
              render={({ field }) => (
                <TextField select label="Severity" {...field}>
                  {Object.entries(severityLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="published_at"
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Publish at"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={field.value || ''}
                />
              )}
            />
            <Controller
              name="is_published"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Published"
                />
              )}
            />
            <Controller
              name="body"
              control={form.control}
              render={({ field }) => <TextField {...field} label="Body" multiline minRows={4} placeholder="Write the full notice content..." />}
            />
            <Controller
              name="external_url"
              control={form.control}
              render={({ field }) => <TextField {...field} label="External link" placeholder="https://status.example.com" />}
            />
            <Controller
              name="attachment"
              control={form.control}
              render={({ field }) => (
                <FileUpload
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  value={field.value as File | null}
                  onChange={(f) => field.onChange(f)}
                  label="Attachment (optional)"
                  existingFileName={existingAttachmentName}
                  existingFileUrl={existingAttachmentUrl}
                  existingFileHint="Current attachment will be kept unless you upload a new one."
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={form.handleSubmit(handleSubmit)} variant="contained" disabled={creating || updating}>
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete notice"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        isSubmitting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default EmisNoticesPage;
