import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Science, ColorLens } from '@mui/icons-material';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { SketchPicker } from 'react-color';
import {
  useGetResearchTagsQuery,
  useCreateResearchTagMutation,
  useUpdateResearchTagMutation,
  useDeleteResearchTagMutation
} from './redux/research.api';
import { IResearchTag, IResearchTagCreatePayload } from './redux/types';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const validationSchema = Yup.object({
  name: Yup.string().required('Tag name is required').max(50, 'Name too long'),
  description: Yup.string().max(200, 'Description too long'),
  color: Yup.string().required('Color is required')
});

const ResearchTags: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<IResearchTag | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { data: tagsData, isLoading: isLoadingTags, error: tagsError } = useGetResearchTagsQuery({});

  const [createTag, { isLoading: isCreating }] = useCreateResearchTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateResearchTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteResearchTagMutation();

  const isLoading = isCreating || isUpdating;

  const formik = useFormik<IResearchTagCreatePayload>({
    initialValues: {
      name: '',
      description: '',
      color: '#1976d2'
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }: FormikHelpers<IResearchTagCreatePayload>) => {
      try {
        if (editingTag) {
          await updateTag({ ...values, id: editingTag.id }).unwrap();
          toast.success('Tag updated successfully');
        } else {
          await createTag(values).unwrap();
          toast.success('Tag created successfully');
        }

        resetForm();
        handleCloseDialog();
      } catch (error) {
        toast.error(editingTag ? 'Failed to update tag' : 'Failed to create tag');
      }
    }
  });

  const handleOpenDialog = (tag?: IResearchTag) => {
    if (tag) {
      setEditingTag(tag);
      formik.setValues({
        name: tag.name,
        description: tag.description || '',
        color: tag.color
      });
    } else {
      setEditingTag(null);
      formik.resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTag(null);
    setShowColorPicker(false);
    formik.resetForm();
  };

  const handleDeleteTag = async () => {
    if (!deleteTagId) return;

    try {
      await deleteTag(deleteTagId).unwrap();
      toast.success('Tag deleted successfully');
      setDeleteTagId(null);
    } catch (error) {
      toast.error('Failed to delete tag');
    }
  };

  const handleColorChange = (color: { hex: string }) => {
    formik.setFieldValue('color', color.hex);
  };

  if (isLoadingTags) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tagsError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load research tags. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Research Tags</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Tag
        </Button>
      </Box>

      {tagsData?.results?.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Science sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Research Tags Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first research tag to organize and categorize research projects.
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
              Create First Tag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {tagsData?.results?.map((tag) => (
            <Grid item xs={12} sm={6} md={4} key={tag.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={tag.name}
                      sx={{
                        bgcolor: tag.color,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    <Box>
                      <IconButton size="small" onClick={() => handleOpenDialog(tag)} sx={{ mr: 1 }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeleteTagId(tag.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {tag.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tag.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: tag.color,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {tag.color}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {tag.research_count} research project{tag.research_count !== 1 ? 's' : ''}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tag Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{editingTag ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>

          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                name="name"
                label="Tag Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
                required
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && !!formik.errors.description}
                helperText={formik.touched.description && formik.errors.description}
                placeholder="Optional description for this tag..."
              />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="body2">Color:</Typography>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: formik.values.color,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formik.values.color}
                  </Typography>
                  <Button size="small" startIcon={<ColorLens />} onClick={() => setShowColorPicker(!showColorPicker)}>
                    {showColorPicker ? 'Hide' : 'Pick'} Color
                  </Button>
                </Box>

                {showColorPicker && (
                  <Box sx={{ mb: 2 }}>
                    <SketchPicker color={formik.values.color} onChange={handleColorChange} width="100%" />
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Preview:</Typography>
                  <Chip
                    label={formik.values.name || 'Sample Tag'}
                    sx={{
                      bgcolor: formik.values.color,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <LoadingButton type="submit" variant="contained" loading={isLoading}>
              {editingTag ? 'Update' : 'Create'}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTagId}
        onClose={() => setDeleteTagId(null)}
        onConfirm={handleDeleteTag}
        title="Delete Research Tag"
        message="Are you sure you want to delete this tag? This action cannot be undone."
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default ResearchTags;
