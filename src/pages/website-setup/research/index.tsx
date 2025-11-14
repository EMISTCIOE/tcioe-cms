import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
import { Science, Tag, Add } from '@mui/icons-material';
import ResearchListing from './ResearchListing';
import ResearchForm from './ResearchForm';
import ResearchTags from './ResearchTags';
import { IResearch } from './redux/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`research-tabpanel-${index}`} aria-labelledby={`research-tab-${index}`}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ResearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingResearch, setEditingResearch] = useState<IResearch | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setShowForm(false);
    setEditingResearch(null);
  };

  const handleCreateResearch = () => {
    setEditingResearch(null);
    setShowForm(true);
    setActiveTab(0);
  };

  const handleEditResearch = (research: IResearch) => {
    setEditingResearch(research);
    setShowForm(true);
    setActiveTab(0);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingResearch(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingResearch(null);
  };

  if (showForm) {
    return <ResearchForm research={editingResearch || undefined} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Research Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage research projects, participants, publications, and research categories
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateResearch}>
          Add Research
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<Science />} label="Research Projects" iconPosition="start" id="research-tab-0" aria-controls="research-tabpanel-0" />
          <Tab icon={<Tag />} label="Tags" iconPosition="start" id="research-tab-1" aria-controls="research-tabpanel-1" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <ResearchListing onEdit={handleEditResearch} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ResearchTags />
      </TabPanel>
    </Box>
  );
};

export default ResearchPage;
