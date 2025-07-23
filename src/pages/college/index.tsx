import React, { ChangeEvent, useState } from 'react';
import { Add, Edit } from '@mui/icons-material';
import { Box, Button, Grid, Paper, Stack, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';

interface CampusInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  organizationChart: File | null;
  active: boolean;
  archived: boolean;
  createdBy: string;
  updatedBy: string;
}

const emptyCampusInfo = (): CampusInfo => ({
  id: '',
  name: '',
  email: '',
  phone: '',
  location: '',
  organizationChart: null,
  active: true,
  archived: false,
  createdBy: '',
  updatedBy: ''
});

export default function Page() {
  const [data, setData] = useState<CampusInfo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CampusInfo>(emptyCampusInfo());
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((f) => ({ ...f, organizationChart: file }));
  };

  const handleChange = (field: keyof CampusInfo) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (field === 'active' || field === 'archived') {
      setForm((f) => ({ ...f, [field]: (e.target as HTMLInputElement).checked }));
      return;
    }
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleAddNew = () => {
    setForm(emptyCampusInfo());
    setIsAdding(true);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;
    setForm(item);
    setEditingId(id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setForm(emptyCampusInfo());
    setEditingId(null);
    setIsAdding(false);
    setError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    // API call
    setLoading(false);
  };

  const isSaveDisabled =
    loading ||
    !form.name.trim() ||
    !form.email.trim() ||
    !form.phone.trim() ||
    !form.location.trim() ||
    !form.createdBy.trim() ||
    !form.updatedBy.trim();

  return (
    <Box maxWidth={800} mx="auto" p={3}>
      <Typography variant="h5" gutterBottom>
        Campus Info Management
      </Typography>

      <Button variant="contained" startIcon={<Add />} onClick={handleAddNew} sx={{ mb: 3 }}>
        Add New Info
      </Button>

      {(isAdding || editingId) && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isAdding ? 'Add New Campus Info' : 'Edit Campus Info'}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Campus Name" value={form.name} onChange={handleChange('name')} fullWidth required size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email Address" value={form.email} onChange={handleChange('email')} fullWidth required size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone Number" value={form.phone} onChange={handleChange('phone')} fullWidth required size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location" value={form.location} onChange={handleChange('location')} fullWidth required size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: 16 }} />
              <Typography variant="caption" display="block">
                Upload Organization Chart (optional)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Checkbox checked={form.active} onChange={handleChange('active')} />} label="Active" />
              <FormControlLabel control={<Checkbox checked={form.archived} onChange={handleChange('archived')} />} label="Archived" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Created by" value={form.createdBy} onChange={handleChange('createdBy')} fullWidth required size="small" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Updated by" value={form.updatedBy} onChange={handleChange('updatedBy')} fullWidth required size="small" />
            </Grid>
          </Grid>

          {error && (
            <Box mt={2}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          <Box mt={2} display="flex" gap={2} justifyContent="flex-end">
            <Button variant="contained" disabled={isSaveDisabled} onClick={handleSave}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Paper>
      )}

      {data.length === 0 ? (
        <Typography>No campus info records found.</Typography>
      ) : (
        data.map((campus) => (
          <Paper key={campus.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Stack spacing={1}>
              <Typography>
                <strong>Name:</strong> {campus.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {campus.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {campus.phone}
              </Typography>
              <Typography>
                <strong>Location:</strong> {campus.location}
              </Typography>
              <Typography>
                <strong>Active:</strong> {campus.active ? 'Yes' : 'No'}
              </Typography>
              <Typography>
                <strong>Archived:</strong> {campus.archived ? 'Yes' : 'No'}
              </Typography>
              <Typography>
                <strong>Created by:</strong> {campus.createdBy}
              </Typography>
              <Typography>
                <strong>Updated by:</strong> {campus.updatedBy}
              </Typography>
              <Typography>
                <strong>Org Chart:</strong> {campus.organizationChart ? campus.organizationChart.name : '-'}
              </Typography>
            </Stack>
            <Box mt={1} display="flex" gap={2}>
              <Button variant="outlined" startIcon={<Edit />} onClick={() => handleEdit(campus.id)} size="small">
                Edit
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}
