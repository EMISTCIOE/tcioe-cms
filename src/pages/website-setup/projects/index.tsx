import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
import { School, Tag, Add } from '@mui/icons-material';
import ProjectListing from './ProjectListing';
import ProjectForm from './ProjectForm';
import ProjectTags from './ProjectTags';
import { IProject } from './redux/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`projects-tabpanel-${index}`} aria-labelledby={`projects-tab-${index}`}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setShowForm(false);
    setEditingProject(null);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowForm(true);
    setActiveTab(0);
  };

  const handleEditProject = (project: IProject) => {
    setEditingProject(project);
    setShowForm(true);
    setActiveTab(0);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (showForm) {
    return <ProjectForm project={editingProject || undefined} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Projects Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage student projects, team members, and project categories
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateProject}>
          Add Project
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<School />} label="Projects" iconPosition="start" id="projects-tab-0" aria-controls="projects-tabpanel-0" />
          <Tab icon={<Tag />} label="Tags" iconPosition="start" id="projects-tab-1" aria-controls="projects-tabpanel-1" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <ProjectListing onEdit={handleEditProject} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ProjectTags />
      </TabPanel>
    </Box>
  );
};

export default ProjectsPage;
