import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

interface IProjectTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  projects_count?: number;
}

const ProjectTags: React.FC = () => {
  const [tags, setTags] = useState<IProjectTag[]>([
    { id: '1', name: 'Web Development', color: '#2196F3', description: 'Web-based projects', projects_count: 5 },
    { id: '2', name: 'Mobile App', color: '#4CAF50', description: 'Mobile application projects', projects_count: 3 },
    { id: '3', name: 'AI/ML', color: '#FF9800', description: 'Artificial Intelligence and Machine Learning', projects_count: 7 },
    { id: '4', name: 'IoT', color: '#9C27B0', description: 'Internet of Things projects', projects_count: 2 }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<IProjectTag | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#2196F3', description: '' });

  const handleAdd = () => {
    setEditingTag(null);
    setFormData({ name: '', color: '#2196F3', description: '' });
    setOpenDialog(true);
  };

  const handleEdit = (tag: IProjectTag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color, description: tag.description || '' });
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const handleSave = () => {
    if (editingTag) {
      setTags((prev) => prev.map((tag) => (tag.id === editingTag.id ? { ...tag, ...formData } : tag)));
    } else {
      const newTag: IProjectTag = {
        id: Date.now().toString(),
        ...formData,
        projects_count: 0
      };
      setTags((prev) => [...prev, newTag]);
    }
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingTag(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Project Tags
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage project categories and tags for better organization
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add Tag
        </Button>
      </Box>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tag Name</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Projects Count</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id} hover>
                  <TableCell>
                    <Chip label={tag.name} sx={{ bgcolor: tag.color, color: 'white' }} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: tag.color,
                          border: '1px solid #ddd'
                        }}
                      />
                      <Typography variant="body2">{tag.color}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{tag.description || 'No description'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{tag.projects_count || 0} projects</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => handleEdit(tag)} title="Edit Tag">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(tag.id)}
                        title="Delete Tag"
                        color="error"
                        disabled={(tag.projects_count || 0) > 0}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTag ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Tag Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />

            <TextField
              label="Color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              placeholder="Optional description for this tag"
            />

            {/* Preview */}
            {formData.name && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Preview:
                </Typography>
                <Chip label={formData.name} sx={{ bgcolor: formData.color, color: 'white' }} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.name.trim()}>
            {editingTag ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTags;
