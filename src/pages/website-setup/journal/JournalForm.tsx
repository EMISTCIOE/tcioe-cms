import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Stack
} from '@mui/material';
import { Add, LibraryBooks, Save, Undo } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  useCreateJournalArticleMutation,
  useUpdateJournalArticleMutation,
  useGetJournalAuthorsQuery,
  useCreateJournalAuthorMutation
} from './redux/journal.api';
import { IJournalArticle, IJournalArticleCreatePayload, IJournalAuthorCreatePayload } from './redux/types';
import { useGetDepartmentsQuery } from '@/pages/website-setup/departments/redux/departments.api';
import { useGetAcademicProgramsQuery } from '@/pages/website-setup/academic/redux/academic.api';

interface JournalFormProps {
  article?: IJournalArticle;
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  url_id: Yup.string().required('URL ID is required'),
  title: Yup.string().required('Title is required'),
  genre: Yup.string().required('Genre is required'),
  abstract: Yup.string().required('Abstract is required')
});

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      width: 320
    }
  }
};

const JournalForm: React.FC<JournalFormProps> = ({ article, onSuccess, onCancel }) => {
  const isEditing = !!article;
  const [createArticle, { isLoading: isCreating }] = useCreateJournalArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateJournalArticleMutation();
  const { data: authorsData, refetch: refetchAuthors } = useGetJournalAuthorsQuery();
  const [createAuthor, { isLoading: isCreatingAuthor }] = useCreateJournalAuthorMutation();
  const { data: departmentData } = useGetDepartmentsQuery({
    search: '',
    paginationModel: { page: 0, pageSize: 200 },
    sortModel: []
  });

  const formik = useFormik<IJournalArticleCreatePayload & { author_ids: string[] }>({
    initialValues: {
      url_id: article?.url_id || '',
      title: article?.title || '',
      genre: article?.genre || '',
      date_published: article?.date_published || '',
      doi_id: article?.doi_id || '',
      abstract: article?.abstract || '',
      keywords: article?.keywords || '',
      discipline: article?.discipline || '',
      department: article?.department || '',
      academic_program: article?.academic_program || '',
      author_ids: article?.authors?.map((a) => a.id) || [],
      submission_id: article?.submission_id || undefined,
      volume: article?.volume || undefined,
      number: article?.number || undefined,
      year: article?.year || undefined,
      pages: article?.pages || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload: IJournalArticleCreatePayload = {
          ...values,
          author_ids: values.author_ids.filter(Boolean)
        };
        if (isEditing) {
          await updateArticle({ ...payload, id: article!.id }).unwrap();
          toast.success('Article updated successfully');
        } else {
          await createArticle(payload).unwrap();
          toast.success('Article created successfully');
        }
        onSuccess();
      } catch {
        toast.error(isEditing ? 'Failed to update article' : 'Failed to create article');
      }
    }
  });

  const { data: programData } = useGetAcademicProgramsQuery({
    limit: 200,
    department: formik.values.department
  });

  const [newAuthor, setNewAuthor] = useState<IJournalAuthorCreatePayload>({
    given_name: '',
    family_name: '',
    email: ''
  });

  const departmentOptions = departmentData?.results || [];
  const programOptions = programData?.results || [];
  const authorOptions = authorsData?.results || [];

  const handleAddAuthor = async () => {
    if (!newAuthor.given_name) {
      toast.error('Author given name is required');
      return;
    }
    try {
      const created = await createAuthor(newAuthor).unwrap();
      toast.success('Author added');
      setNewAuthor({ given_name: '', family_name: '', email: '' });
      await refetchAuthors();
      if (created?.id) {
        formik.setFieldValue('author_ids', [...formik.values.author_ids, created.id]);
      }
    } catch {
      toast.error('Failed to add author');
    }
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">{isEditing ? 'Edit Journal Article' : 'Create Journal Article'}</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage journal metadata, department/program linkage, and authorship
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<Undo />} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<Save />} disabled={isCreating || isUpdating}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LibraryBooks fontSize="small" /> Article Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="url_id"
                    label="URL ID"
                    value={formik.values.url_id}
                    onChange={formik.handleChange}
                    error={formik.touched.url_id && !!formik.errors.url_id}
                    helperText={formik.touched.url_id && formik.errors.url_id}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && !!formik.errors.title}
                    helperText={formik.touched.title && formik.errors.title}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="genre"
                    label="Genre"
                    value={formik.values.genre}
                    onChange={formik.handleChange}
                    error={formik.touched.genre && !!formik.errors.genre}
                    helperText={formik.touched.genre && formik.errors.genre}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    name="date_published"
                    label="Published Date"
                    value={formik.values.date_published || ''}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="doi_id"
                    label="DOI"
                    value={formik.values.doi_id || ''}
                    onChange={formik.handleChange}
                    helperText="Optional DOI identifier"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="discipline"
                    label="Discipline"
                    value={formik.values.discipline || ''}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="keywords"
                    label="Keywords"
                    value={formik.values.keywords || ''}
                    onChange={formik.handleChange}
                    placeholder="AI, Civil Engineering, Architecture..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    name="department"
                    label="Department"
                    value={formik.values.department || ''}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue('academic_program', '');
                    }}
                    helperText="Link this article to a department"
                  >
                    <MenuItem value="">Select Department</MenuItem>
                    {departmentOptions.map((dept: any) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name} {dept.short_name ? `(${dept.short_name})` : ''}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    name="academic_program"
                    label="Academic Program (optional)"
                    value={formik.values.academic_program || ''}
                    onChange={formik.handleChange}
                    helperText="Optional program linkage"
                  >
                    <MenuItem value="">All Programs</MenuItem>
                    {programOptions.map((program: any) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.name} {program.short_name ? `(${program.short_name})` : ''}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    name="abstract"
                    label="Abstract"
                    value={formik.values.abstract}
                    onChange={formik.handleChange}
                    error={formik.touched.abstract && !!formik.errors.abstract}
                    helperText={formik.touched.abstract && formik.errors.abstract}
                    placeholder="Summarize the article..."
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="submission_id"
                    label="Submission ID"
                    type="number"
                    value={formik.values.submission_id ?? ''}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="volume"
                    label="Volume"
                    type="number"
                    value={formik.values.volume ?? ''}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="number"
                    label="Issue Number"
                    type="number"
                    value={formik.values.number ?? ''}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="year"
                    label="Year"
                    type="number"
                    value={formik.values.year ?? ''}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="pages"
                    label="Pages"
                    value={formik.values.pages || ''}
                    onChange={formik.handleChange}
                    placeholder="e.g. 10-24"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Authors
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="author-select-label">Select Authors</InputLabel>
                    <Select
                      labelId="author-select-label"
                      multiple
                      value={formik.values.author_ids}
                      onChange={(e) => formik.setFieldValue('author_ids', e.target.value as string[])}
                      input={<OutlinedInput label="Select Authors" />}
                      renderValue={(selected) =>
                        authorOptions
                          .filter((a) => (selected as string[]).includes(a.id))
                          .map((a) => `${a.given_name} ${a.family_name || ''}`.trim())
                          .join(', ')
                      }
                      MenuProps={MenuProps}
                    >
                      {authorOptions.map((author) => (
                        <MenuItem key={author.id} value={author.id}>
                          <Checkbox checked={formik.values.author_ids.includes(author.id)} />
                          <ListItemText primary={`${author.given_name} ${author.family_name || ''}`} secondary={author.affiliation} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Quick Add Author
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Given Name"
                        value={newAuthor.given_name}
                        onChange={(e) => setNewAuthor((prev) => ({ ...prev, given_name: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Family Name"
                        value={newAuthor.family_name || ''}
                        onChange={(e) => setNewAuthor((prev) => ({ ...prev, family_name: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Email"
                        value={newAuthor.email || ''}
                        onChange={(e) => setNewAuthor((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Affiliation"
                        value={newAuthor.affiliation || ''}
                        onChange={(e) => setNewAuthor((prev) => ({ ...prev, affiliation: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button size="small" variant="outlined" startIcon={<Add />} onClick={handleAddAuthor} disabled={isCreatingAuthor}>
                        Add Author
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JournalForm;
