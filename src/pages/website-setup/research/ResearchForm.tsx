import React, { useState } from 'react';
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
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Add, Delete, GitHub, Language, Dataset, Science, ExpandMore } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { RichTextEditor } from '@/components/RichTextEditor';
import { FileUpload } from '@/components/FileUpload';
import { useCreateResearchMutation, useUpdateResearchMutation, useGetResearchTagsQuery } from './redux/research.api';
import {
  IResearch,
  IResearchParticipant,
  IResearchPublication,
  IResearchCreatePayload,
  IResearchParticipantCreatePayload,
  IResearchPublicationCreatePayload
} from './redux/types';
import { toast } from 'react-toastify';
import { useGetDepartmentsQuery } from '@/pages/website-setup/departments/redux/departments.api';
import { useGetAcademicProgramsQuery } from '@/pages/website-setup/academic/redux/academic.api';

interface ResearchFormProps {
  research?: IResearch;
  onSuccess: () => void;
  onCancel: () => void;
}

const RESEARCH_TYPES = [
  { value: 'basic', label: 'Basic Research' },
  { value: 'applied', label: 'Applied Research' },
  { value: 'development', label: 'Development' },
  { value: 'interdisciplinary', label: 'Interdisciplinary' },
  { value: 'collaborative', label: 'Collaborative' }
];

const RESEARCH_STATUSES = [
  { value: 'proposal', label: 'Proposal' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' }
];

const PARTICIPANT_TYPES = [
  { value: 'faculty', label: 'Faculty' },
  { value: 'staff', label: 'Staff' },
  { value: 'student', label: 'Student' },
  { value: 'external', label: 'External Collaborator' }
];

const CURRENCIES = [
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' }
];

const validationSchema = Yup.object({
  title: Yup.string().required('Research title is required').max(300, 'Title too long'),
  abstract: Yup.string().max(2000, 'Abstract too long'),
  research_type: Yup.string().required('Research type is required'),
  status: Yup.string().required('Status is required'),
  field_of_study: Yup.string().required('Field of study is required').max(100, 'Field too long'),
  keywords: Yup.string().max(500, 'Keywords too long'),
  methodology: Yup.string().max(1000, 'Methodology too long'),
  duration_months: Yup.number().min(1, 'Duration must be at least 1 month').max(120, 'Duration too long'),
  funding_amount: Yup.number().min(0, 'Amount must be positive'),
  github_url: Yup.string().url('Invalid URL format'),
  dataset_url: Yup.string().url('Invalid URL format'),
  website_url: Yup.string().url('Invalid URL format'),
  participants: Yup.array()
    .of(
      Yup.object({
        full_name: Yup.string().required('Full name is required').max(200, 'Name too long'),
        email: Yup.string().email('Invalid email format'),
        participant_type: Yup.string().required('Participant type is required'),
        role: Yup.string().required('Role is required').max(100, 'Role too long'),
        affiliation: Yup.string().max(200, 'Affiliation too long')
      })
    )
    .min(1, 'At least one participant is required')
});

const ResearchForm: React.FC<ResearchFormProps> = ({ research, onSuccess, onCancel }) => {
  const [createResearch, { isLoading: isCreating }] = useCreateResearchMutation();
  const [updateResearch, { isLoading: isUpdating }] = useUpdateResearchMutation();
  const { data: tagsData } = useGetResearchTagsQuery({});
  const { data: departmentData } = useGetDepartmentsQuery({
    search: '',
    paginationModel: { page: 0, pageSize: 200 },
    sortModel: []
  });

  const isEditing = !!research;
  const isLoading = isCreating || isUpdating;

  const formik = useFormik<IResearchCreatePayload>({
    initialValues: {
      title: research?.title || '',
      description: research?.description || '',
      abstract: research?.abstract || '',
      research_type: research?.research_type || 'basic',
      status: research?.status || 'proposal',
      field_of_study: research?.field_of_study || '',
      keywords: research?.keywords || '',
      methodology: research?.methodology || '',
      start_date: research?.start_date || '',
      end_date: research?.end_date || '',
      duration_months: research?.duration_months || undefined,
      funding_agency: research?.funding_agency || '',
      funding_amount: research?.funding_amount || undefined,
      funding_currency: research?.funding_currency || 'INR',
      expected_outcomes: research?.expected_outcomes || '',
      ethical_approval_number: research?.ethical_approval_number || '',
      is_collaborative: research?.is_collaborative || false,
      collaboration_details: research?.collaboration_details || '',
      github_url: research?.github_url || '',
      dataset_url: research?.dataset_url || '',
      website_url: research?.website_url || '',
      is_featured: research?.is_featured || false,
      is_published: research?.is_published || false,
      department: research?.department || undefined,
      academic_program: research?.academic_program || undefined,
      participants: research?.participants || [
        {
          full_name: '',
          email: '',
          participant_type: 'faculty',
          affiliation: '',
          role: 'Principal Investigator'
        }
      ],
      publications: research?.publications || [],
      tag_ids: research?.tags?.map((tag) => tag.id) || []
    },
    validationSchema,
    onSubmit: async (values: IResearchCreatePayload) => {
      try {
        const formData = {
          ...values,
          participants: values.participants.filter((p: IResearchParticipantCreatePayload) => p.full_name && p.role),
          publications: values.publications.filter((p: IResearchPublicationCreatePayload) => p.title && p.authors)
        };

        if (isEditing) {
          await updateResearch({ ...formData, id: research!.id }).unwrap();
          toast.success('Research updated successfully');
        } else {
          await createResearch(formData).unwrap();
          toast.success('Research created successfully');
        }

        onSuccess();
      } catch (error) {
      toast.error(isEditing ? 'Failed to update research' : 'Failed to create research');
    }
  }
});

  const { data: programData } = useGetAcademicProgramsQuery({
    limit: 200,
    department: formik.values.department
  });

  const departmentOptions = departmentData?.results || [];
  const programOptions = programData?.results || [];

  const addParticipant = () => {
    formik.setFieldValue('participants', [
      ...formik.values.participants,
      {
        full_name: '',
        email: '',
        participant_type: 'faculty',
        affiliation: '',
        role: 'Researcher'
      }
    ]);
  };

  const removeParticipant = (index: number) => {
    const newParticipants = formik.values.participants.filter((_: IResearchParticipantCreatePayload, i: number) => i !== index);
    formik.setFieldValue('participants', newParticipants);
  };

  const updateParticipant = (index: number, field: keyof IResearchParticipantCreatePayload, value: string) => {
    const newParticipants = [...formik.values.participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    formik.setFieldValue('participants', newParticipants);
  };

  const addPublication = () => {
    formik.setFieldValue('publications', [
      ...formik.values.publications,
      {
        title: '',
        authors: '',
        journal_name: '',
        conference_name: '',
        publication_date: '',
        doi: '',
        url: '',
        citation_count: undefined
      }
    ]);
  };

  const removePublication = (index: number) => {
    const newPublications = formik.values.publications.filter((_: IResearchPublicationCreatePayload, i: number) => i !== index);
    formik.setFieldValue('publications', newPublications);
  };

  const updatePublication = (index: number, field: keyof IResearchPublicationCreatePayload, value: string | number) => {
    const newPublications = [...formik.values.publications];
    newPublications[index] = { ...newPublications[index], [field]: value };
    formik.setFieldValue('publications', newPublications);
  };

  const toggleTag = (tagId: number) => {
    const currentTags = formik.values.tag_ids;
    const newTags = currentTags.includes(tagId) ? currentTags.filter((id: string) => id !== tagId) : [...currentTags, tagId];
    formik.setFieldValue('tag_ids', newTags);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{isEditing ? 'Edit Research' : 'Create New Research'}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} startIcon={<Science />}>
            {isEditing ? 'Update Research' : 'Create Research'}
          </LoadingButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Research Title"
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
                    name="research_type"
                    label="Research Type"
                    value={formik.values.research_type}
                    onChange={formik.handleChange}
                    error={formik.touched.research_type && !!formik.errors.research_type}
                    helperText={formik.touched.research_type && formik.errors.research_type}
                    required
                  >
                    {RESEARCH_TYPES.map((type) => (
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
                    {RESEARCH_STATUSES.map((status) => (
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
                    helperText="Link this research to a department"
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
                    helperText="Further narrow to a specific academic program"
                    disabled={!departmentOptions.length}
                  >
                    <MenuItem value="">All Programs</MenuItem>
                    {programOptions.map((program: any) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.name} {program.short_name ? `(${program.short_name})` : ''}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="field_of_study"
                    label="Field of Study"
                    value={formik.values.field_of_study}
                    onChange={formik.handleChange}
                    error={formik.touched.field_of_study && !!formik.errors.field_of_study}
                    helperText={formik.touched.field_of_study && formik.errors.field_of_study}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="keywords"
                    label="Keywords"
                    value={formik.values.keywords}
                    onChange={formik.handleChange}
                    error={formik.touched.keywords && !!formik.errors.keywords}
                    helperText={formik.touched.keywords && formik.errors.keywords}
                    placeholder="Machine Learning, AI, Data Science, etc."
                  />
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
                    placeholder="Brief abstract of the research..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <RichTextEditor
                    label="Detailed Description"
                    value={formik.values.description || ''}
                    onChange={(value: string) => formik.setFieldValue('description', value)}
                    placeholder="Detailed research description including objectives, methodology, expected outcomes, etc."
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Timeline & Funding */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Timeline & Funding</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
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

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    name="duration_months"
                    label="Duration (Months)"
                    value={formik.values.duration_months || ''}
                    onChange={formik.handleChange}
                    error={formik.touched.duration_months && !!formik.errors.duration_months}
                    helperText={formik.touched.duration_months && formik.errors.duration_months}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="funding_agency"
                    label="Funding Agency"
                    value={formik.values.funding_agency}
                    onChange={formik.handleChange}
                    placeholder="DST, SERB, UGC, etc."
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    name="funding_amount"
                    label="Funding Amount"
                    value={formik.values.funding_amount || ''}
                    onChange={formik.handleChange}
                    error={formik.touched.funding_amount && !!formik.errors.funding_amount}
                    helperText={formik.touched.funding_amount && formik.errors.funding_amount}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    select
                    name="funding_currency"
                    label="Currency"
                    value={formik.values.funding_currency}
                    onChange={formik.handleChange}
                  >
                    {CURRENCIES.map((currency) => (
                      <MenuItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="ethical_approval_number"
                    label="Ethical Approval Number"
                    value={formik.values.ethical_approval_number}
                    onChange={formik.handleChange}
                    placeholder="If applicable"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Methodology & Outcomes */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Methodology & Expected Outcomes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="methodology"
                    label="Research Methodology"
                    value={formik.values.methodology}
                    onChange={formik.handleChange}
                    error={formik.touched.methodology && !!formik.errors.methodology}
                    helperText={formik.touched.methodology && formik.errors.methodology}
                    placeholder="Describe the research methodology and approach..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="expected_outcomes"
                    label="Expected Outcomes"
                    value={formik.values.expected_outcomes}
                    onChange={formik.handleChange}
                    placeholder="Describe the expected outcomes and impact..."
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Collaboration */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Collaboration Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="is_collaborative"
                        checked={formik.values.is_collaborative}
                        onChange={(e) => formik.setFieldValue('is_collaborative', e.target.checked)}
                      />
                    }
                    label="This is a collaborative research project"
                  />
                </Grid>

                {formik.values.is_collaborative && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="collaboration_details"
                      label="Collaboration Details"
                      value={formik.values.collaboration_details}
                      onChange={formik.handleChange}
                      placeholder="Describe the collaboration, partner institutions, roles, etc."
                    />
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* External Links */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">External Links</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
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

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="dataset_url"
                    label="Dataset URL"
                    value={formik.values.dataset_url}
                    onChange={formik.handleChange}
                    error={formik.touched.dataset_url && !!formik.errors.dataset_url}
                    helperText={formik.touched.dataset_url && formik.errors.dataset_url}
                    InputProps={{
                      startAdornment: <Dataset sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="website_url"
                    label="Research Website URL"
                    value={formik.values.website_url}
                    onChange={formik.handleChange}
                    error={formik.touched.website_url && !!formik.errors.website_url}
                    helperText={formik.touched.website_url && formik.errors.website_url}
                    InputProps={{
                      startAdornment: <Language sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Research Participants */}
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Research Participants ({formik.values.participants.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Button variant="outlined" startIcon={<Add />} onClick={addParticipant}>
                  Add Participant
                </Button>
              </Box>

              {formik.values.participants.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Add at least one participant to the research project.
                </Alert>
              )}

              {formik.values.participants.map((participant: IResearchParticipantCreatePayload, index: number) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">Participant {index + 1}</Typography>
                      {formik.values.participants.length > 1 && (
                        <IconButton color="error" onClick={() => removeParticipant(index)} size="small">
                          <Delete />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={participant.full_name}
                          onChange={(e) => updateParticipant(index, 'full_name', e.target.value)}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={participant.email || ''}
                          onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          select
                          label="Participant Type"
                          value={participant.participant_type}
                          onChange={(e) => updateParticipant(index, 'participant_type', e.target.value)}
                          required
                        >
                          {PARTICIPANT_TYPES.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Role"
                          value={participant.role}
                          onChange={(e) => updateParticipant(index, 'role', e.target.value)}
                          placeholder="Principal Investigator, Research Associate, etc."
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Affiliation"
                          value={participant.affiliation || ''}
                          onChange={(e) => updateParticipant(index, 'affiliation', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="LinkedIn URL"
                          value={participant.linkedin_url || ''}
                          onChange={(e) => updateParticipant(index, 'linkedin_url', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="ORCID ID"
                          value={participant.orcid_id || ''}
                          onChange={(e) => updateParticipant(index, 'orcid_id', e.target.value)}
                          placeholder="0000-0000-0000-0000"
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Google Scholar URL"
                          value={participant.google_scholar_url || ''}
                          onChange={(e) => updateParticipant(index, 'google_scholar_url', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Publications */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Related Publications ({formik.values.publications.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Button variant="outlined" startIcon={<Add />} onClick={addPublication}>
                  Add Publication
                </Button>
              </Box>

              {formik.values.publications.map((publication: IResearchPublicationCreatePayload, index: number) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">Publication {index + 1}</Typography>
                      <IconButton color="error" onClick={() => removePublication(index)} size="small">
                        <Delete />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Publication Title"
                          value={publication.title}
                          onChange={(e) => updatePublication(index, 'title', e.target.value)}
                          required
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Authors"
                          value={publication.authors}
                          onChange={(e) => updatePublication(index, 'authors', e.target.value)}
                          placeholder="Author 1, Author 2, Author 3, etc."
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Journal Name"
                          value={publication.journal_name || ''}
                          onChange={(e) => updatePublication(index, 'journal_name', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Conference Name"
                          value={publication.conference_name || ''}
                          onChange={(e) => updatePublication(index, 'conference_name', e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Publication Date"
                          value={publication.publication_date || ''}
                          onChange={(e) => updatePublication(index, 'publication_date', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="DOI"
                          value={publication.doi || ''}
                          onChange={(e) => updatePublication(index, 'doi', e.target.value)}
                          placeholder="10.1000/xyz123"
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Citation Count"
                          value={publication.citation_count || ''}
                          onChange={(e) => updatePublication(index, 'citation_count', parseInt(e.target.value) || 0)}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Publication URL"
                          value={publication.url || ''}
                          onChange={(e) => updatePublication(index, 'url', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Tags */}
        {tagsData?.results && (
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Research Tags</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}

        {/* Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Publication Settings
              </Typography>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_featured"
                      checked={formik.values.is_featured}
                      onChange={(e) => formik.setFieldValue('is_featured', e.target.checked)}
                    />
                  }
                  label="Featured Research"
                />

                <FormControlLabel
                  control={
                    <Switch
                      name="is_published"
                      checked={formik.values.is_published}
                      onChange={(e) => formik.setFieldValue('is_published', e.target.checked)}
                    />
                  }
                  label="Publish Research"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResearchForm;
