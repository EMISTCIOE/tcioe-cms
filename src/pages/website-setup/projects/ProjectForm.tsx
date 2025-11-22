import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import { Add, Delete, GitHub, Launch, School } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { RichTextEditor } from '@/components/RichTextEditor';
import { FileUpload } from '@/components/FileUpload';
import { useCreateProjectMutation, useUpdateProjectMutation, useGetProjectTagsQuery } from './redux/projects.api';
import { IProject, IProjectMember, IProjectCreatePayload } from './redux/types';
import { toast } from 'react-toastify';
import { useGetDepartmentsQuery } from '@/pages/website-setup/departments/redux/departments.api';
import { useGetAcademicProgramsQuery } from '@/pages/website-setup/academic/redux/academic.api';

interface ProjectFormProps {
  project?: IProject;
  onSuccess: () => void;
  onCancel: () => void;
}

const PROJECT_TYPES = [
  { value: 'final_year', label: 'Final Year Project' },
  { value: 'major', label: 'Major Project' },
  { value: 'minor', label: 'Minor Project' },
  { value: 'research', label: 'Research Project' },
  { value: 'other', label: 'Other' }
];

const PROJECT_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const validationSchema = Yup.object({
  title: Yup.string().required('Project title is required').max(300, 'Title too long'),
  abstract: Yup.string().max(1000, 'Abstract too long'),
  project_type: Yup.string().required('Project type is required'),
  status: Yup.string().required('Status is required'),
  supervisor_name: Yup.string().required('Supervisor name is required').max(200, 'Name too long'),
  supervisor_email: Yup.string().email('Invalid email format'),
  academic_year: Yup.string().max(20, 'Academic year too long'),
  github_url: Yup.string().url('Invalid URL format'),
  demo_url: Yup.string().url('Invalid URL format'),
  members: Yup.array()
    .of(
      Yup.object({
        full_name: Yup.string().required('Full name is required').max(200, 'Name too long'),
        roll_number: Yup.string().required('Roll number is required').max(50, 'Roll number too long'),
        email: Yup.string().email('Invalid email format'),
        role: Yup.string().required('Role is required').max(100, 'Role too long')
      })
    )
    .min(1, 'At least one team member is required')
});

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSuccess, onCancel }) => {
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const { data: tagsData } = useGetProjectTagsQuery();
  const { data: departmentData } = useGetDepartmentsQuery({
    search: '',
    paginationModel: { page: 0, pageSize: 200 },
    sortModel: []
  });

  const isEditing = !!project;
  const isLoading = isCreating || isUpdating;

  const formik = useFormik<IProjectCreatePayload>({
    initialValues: {
      title: project?.title || '',
      description: project?.description || '',
      abstract: project?.abstract || '',
      project_type: project?.project_type || 'final_year',
      status: project?.status || 'draft',
      department: project?.department || undefined,
      academic_program: project?.academic_program || undefined,
      supervisor_name: project?.supervisor_name || '',
      supervisor_email: project?.supervisor_email || '',
      start_date: project?.start_date || '',
      end_date: project?.end_date || '',
      academic_year: project?.academic_year || '',
      github_url: project?.github_url || '',
      demo_url: project?.demo_url || '',
      technologies_used: project?.technologies_used || '',
      is_featured: project?.is_featured || false,
      is_published: project?.is_published || false,
      members: project?.members || [
        {
          full_name: '',
          roll_number: '',
          email: '',
          role: 'Team Member'
        }
      ],
      tag_ids: project?.tags?.map((tag) => tag.id) || []
    },
    validationSchema,
    onSubmit: async (values: IProjectCreatePayload) => {
      try {
        const formData = {
          ...values,
          members: values.members.filter((member: IProjectMember) => member.full_name && member.roll_number)
        };

        if (isEditing) {
          await updateProject({ ...formData, id: project!.id }).unwrap();
          toast.success('Project updated successfully');
        } else {
          await createProject(formData).unwrap();
          toast.success('Project created successfully');
        }

        onSuccess();
      } catch (error) {
        toast.error(isEditing ? 'Failed to update project' : 'Failed to create project');
      }
    }
  });

  const { data: programData } = useGetAcademicProgramsQuery({
    limit: 200,
    department: formik.values.department
  });

  const departmentOptions = departmentData?.results || [];
  const programOptions = programData?.results || [];

  const addMember = () => {
    formik.setFieldValue('members', [
      ...formik.values.members,
      {
        full_name: '',
        roll_number: '',
        email: '',
        role: 'Team Member'
      }
    ]);
  };

  const removeMember = (index: number) => {
    const newMembers = formik.values.members.filter((_: IProjectMember, i: number) => i !== index);
    formik.setFieldValue('members', newMembers);
  };

  const updateMember = (index: number, field: keyof IProjectMember, value: string) => {
    const newMembers = [...formik.values.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    formik.setFieldValue('members', newMembers);
  };

  const toggleTag = (tagId: string) => {
    const currentTags = formik.values.tag_ids;
    const newTags = currentTags.includes(tagId) ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId];
    formik.setFieldValue('tag_ids', newTags);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{isEditing ? 'Edit Project' : 'Create New Project'}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} startIcon={<School />}>
            {isEditing ? 'Update Project' : 'Create Project'}
          </LoadingButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Project Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && !!formik.errors.title}
                    helperText={formik.touched.title && formik.errors.title}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="project_type"
                    label="Project Type"
                    value={formik.values.project_type}
                    onChange={formik.handleChange}
                    error={formik.touched.project_type && !!formik.errors.project_type}
                    helperText={formik.touched.project_type && formik.errors.project_type}
                    required
                  >
                    {PROJECT_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="status"
                    label="Status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && !!formik.errors.status}
                    helperText={formik.touched.status && formik.errors.status}
                    required
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="department"
                    label="Department"
                    value={formik.values.department || ''}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue('academic_program', '');
                    }}
                    helperText="Link this project to a department"
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
                    fullWidth
                    select
                    name="academic_program"
                    label="Academic Program (optional)"
                    value={formik.values.academic_program || ''}
                    onChange={formik.handleChange}
                    helperText="Associate this project with a specific academic program"
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
                    rows={3}
                    name="abstract"
                    label="Abstract"
                    value={formik.values.abstract}
                    onChange={formik.handleChange}
                    error={formik.touched.abstract && !!formik.errors.abstract}
                    helperText={formik.touched.abstract && formik.errors.abstract}
                    placeholder="Brief description of the project..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <RichTextEditor
                    label="Detailed Description"
                    value={formik.values.description || ''}
                    onChange={(value: string) => formik.setFieldValue('description', value)}
                    placeholder="Detailed project description with technical details, objectives, etc."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Supervisor Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Supervisor Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="supervisor_name"
                    label="Supervisor Name"
                    value={formik.values.supervisor_name}
                    onChange={formik.handleChange}
                    error={formik.touched.supervisor_name && !!formik.errors.supervisor_name}
                    helperText={formik.touched.supervisor_name && formik.errors.supervisor_name}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="supervisor_email"
                    label="Supervisor Email"
                    type="email"
                    value={formik.values.supervisor_email}
                    onChange={formik.handleChange}
                    error={formik.touched.supervisor_email && !!formik.errors.supervisor_email}
                    helperText={formik.touched.supervisor_email && formik.errors.supervisor_email}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Members */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Team Members ({formik.values.members.length})</Typography>
                <Button variant="outlined" startIcon={<Add />} onClick={addMember}>
                  Add Member
                </Button>
              </Box>

              {formik.values.members.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Add at least one team member to the project.
                </Alert>
              )}

              {formik.values.members.map((member: IProjectMember, index: number) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">Member {index + 1}</Typography>
                      {formik.values.members.length > 1 && (
                        <IconButton color="error" onClick={() => removeMember(index)} size="small">
                          <Delete />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={member.full_name}
                          onChange={(e) => updateMember(index, 'full_name', e.target.value)}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Roll Number"
                          value={member.roll_number}
                          onChange={(e) => updateMember(index, 'roll_number', e.target.value)}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={member.email || ''}
                          onChange={(e) => updateMember(index, 'email', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Role"
                          value={member.role}
                          onChange={(e) => updateMember(index, 'role', e.target.value)}
                          placeholder="Team Leader, Developer, Designer, etc."
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="LinkedIn URL"
                          value={member.linkedin_url || ''}
                          onChange={(e) => updateMember(index, 'linkedin_url', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="GitHub URL"
                          value={member.github_url || ''}
                          onChange={(e) => updateMember(index, 'github_url', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Project Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="academic_year"
                    label="Academic Year"
                    value={formik.values.academic_year}
                    onChange={formik.handleChange}
                    placeholder="2024-2025"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    name="start_date"
                    label="Start Date"
                    value={formik.values.start_date}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    name="end_date"
                    label="End Date"
                    value={formik.values.end_date}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="technologies_used"
                    label="Technologies Used"
                    value={formik.values.technologies_used}
                    onChange={formik.handleChange}
                    placeholder="React, Node.js, MongoDB, Python, etc."
                    helperText="Comma-separated list of technologies"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="github_url"
                    label="GitHub Repository URL"
                    value={formik.values.github_url}
                    onChange={formik.handleChange}
                    error={formik.touched.github_url && !!formik.errors.github_url}
                    helperText={formik.touched.github_url && formik.errors.github_url}
                    InputProps={{
                      startAdornment: <GitHub sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="demo_url"
                    label="Live Demo URL"
                    value={formik.values.demo_url}
                    onChange={formik.handleChange}
                    error={formik.touched.demo_url && !!formik.errors.demo_url}
                    helperText={formik.touched.demo_url && formik.errors.demo_url}
                    InputProps={{
                      startAdornment: <Launch sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tags */}
        {tagsData?.results && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Project Tags
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tagsData.results.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      onClick={() => toggleTag(tag.id)}
                      color={formik.values.tag_ids.includes(tag.id) ? 'primary' : 'default'}
                      variant={formik.values.tag_ids.includes(tag.id) ? 'filled' : 'outlined'}
                      sx={{
                        bgcolor: formik.values.tag_ids.includes(tag.id) ? tag.color : 'transparent',
                        borderColor: tag.color,
                        '&:hover': {
                          bgcolor: formik.values.tag_ids.includes(tag.id) ? tag.color : `${tag.color}20`
                        }
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Files and Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Files & Settings
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Project Thumbnail"
                    accept="image/*"
                    onChange={(file: File | File[] | null) => {
                      if (file && !Array.isArray(file)) {
                        formik.setFieldValue('thumbnail', file);
                      }
                    }}
                    helperText="Upload project thumbnail image"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FileUpload
                    label="Project Report"
                    accept=".pdf,.doc,.docx"
                    onChange={(file: File | File[] | null) => {
                      if (file && !Array.isArray(file)) {
                        formik.setFieldValue('report_file', file);
                      }
                    }}
                    helperText="Upload project report (PDF/DOC)"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="is_featured"
                          checked={formik.values.is_featured}
                          onChange={(e) => formik.setFieldValue('is_featured', e.target.checked)}
                        />
                      }
                      label="Featured Project"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          name="is_published"
                          checked={formik.values.is_published}
                          onChange={(e) => formik.setFieldValue('is_published', e.target.checked)}
                        />
                      }
                      label="Publish Project"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectForm;
