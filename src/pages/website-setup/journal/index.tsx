import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import JournalListing from './JournalListing';
import JournalForm from './JournalForm';
import { IJournalArticle } from './redux/types';

const JournalPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<IJournalArticle | null>(null);

  const handleCreate = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  const handleEdit = (article: IJournalArticle) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  if (showForm) {
    return <JournalForm article={editingArticle || undefined} onSuccess={handleSuccess} onCancel={handleCancel} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Journal Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage journal articles, authors, and department/program linkage
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Article
        </Button>
      </Box>

      <JournalListing onEdit={handleEdit} />
    </Box>
  );
};

export default JournalPage;
