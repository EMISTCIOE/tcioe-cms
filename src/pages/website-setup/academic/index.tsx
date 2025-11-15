import React, { useState } from 'react';
import { Add, MenuBook, School } from '@mui/icons-material';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { validatePermissions } from '@/utils/permissions/validatePermissions';
import { AcademicProgramForm } from './AcademicProgramForm';
import { ProgramsListing } from './ProgramsListing';
import { SubjectForm } from './SubjectForm';
import { SubjectsListing } from './SubjectsListing';
import { IAcademicProgram, ISubject } from './types';
import { academicModulePermissions } from './constants/permissions';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} aria-labelledby={`academic-tab-${index}`}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const AcademicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<IAcademicProgram | null>(null);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<ISubject | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setShowProgramForm(false);
    setEditingProgram(null);
    setShowSubjectForm(false);
    setEditingSubject(null);
  };

  const handleCreateProgram = () => {
    setEditingProgram(null);
    setShowProgramForm(true);
  };

  const handleEditProgram = (program: IAcademicProgram) => {
    setEditingProgram(program);
    setShowProgramForm(true);
  };

  const handleProgramFormCancel = () => {
    setShowProgramForm(false);
    setEditingProgram(null);
  };

  const handleProgramFormSuccess = () => {
    setShowProgramForm(false);
    setEditingProgram(null);
  };

  const handleCreateSubject = () => {
    setEditingSubject(null);
    setShowSubjectForm(true);
  };

  const handleEditSubject = (subject: ISubject) => {
    setEditingSubject(subject);
    setShowSubjectForm(true);
  };

  const handleSubjectFormCancel = () => {
    setShowSubjectForm(false);
    setEditingSubject(null);
  };

  const handleSubjectFormSuccess = () => {
    setShowSubjectForm(false);
    setEditingSubject(null);
  };

  const handleAddClick = () => {
    if (activeTab === 0) {
      handleCreateProgram();
    } else {
      handleCreateSubject();
    }
  };

  if (activeTab === 0 && showProgramForm) {
    return <AcademicProgramForm program={editingProgram ?? undefined} onCancel={handleProgramFormCancel} onSuccess={handleProgramFormSuccess} />;
  }

  if (activeTab === 1 && showSubjectForm) {
    return <SubjectForm subject={editingSubject ?? undefined} onCancel={handleSubjectFormCancel} onSuccess={handleSubjectFormSuccess} />;
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Academic Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage department programs and the curriculum subjects from a single place.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          {activeTab === 0 ? 'Add Program' : 'Add Subject'}
        </Button>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<School />} label="Programs" iconPosition="start" id="academic-tab-0" aria-controls="academic-panel-0" />
          <Tab icon={<MenuBook />} label="Subjects" iconPosition="start" id="academic-tab-1" aria-controls="academic-panel-1" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <ProgramsListing onEdit={handleEditProgram} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <SubjectsListing onEdit={handleEditSubject} />
      </TabPanel>
    </Box>
  );
};

export default validatePermissions(AcademicPage, academicModulePermissions);
