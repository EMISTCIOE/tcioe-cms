import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Stack, Chip } from '@mui/material';
import {
  Computer as ComputerIcon,
  Cloud as CloudIcon,
  Email as EmailIcon,
  Hardware as HardwareIcon,
  NetworkCheck as NetworkIcon,
  Download as DownloadIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmisManagementDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Hardware Management',
      description:
        'Manage hardware inventory including routers, servers, switches, and other network equipment with thumbnail images and specifications.',
      icon: <ComputerIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      path: '/website-setup/emis-management/hardware',
      color: 'primary.main',
      features: ['CRUD Operations', 'Image Upload', 'Specifications', 'Location Tracking']
    },
    {
      title: 'VPS Management',
      description: 'Monitor and manage VPS servers with resource tracking (RAM, CPU) and service management for domains and ports.',
      icon: <CloudIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      path: '/website-setup/emis-management/vps',
      color: 'secondary.main',
      features: ['Resource Monitoring', 'Service Management', 'Port Configuration', 'SSL Tracking']
    },
    {
      title: 'Email Reset Requests',
      description: 'Process student email reset requests with approval/rejection workflow and webhook integration.',
      icon: <EmailIcon sx={{ fontSize: 48, color: 'error.main' }} />,
      path: '/website-setup/emis-management/email-reset',
      color: 'error.main',
      features: ['Approval Workflow', 'Phone Verification', 'Webhook Integration', 'Request Tracking']
    },
    {
      title: 'Downloads',
      description: 'Central library for EMIS forms, reports, and resources.',
      icon: <DownloadIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      path: '/website-setup/emis-management/downloads',
      color: 'success.main',
      features: ['Forms & Reports', 'External Links', 'File Uploads']
    },
    {
      title: 'EMIS Notices',
      description: 'Publish security advisories, maintenance windows, and release updates for EMIS.',
      icon: <NotificationsIcon sx={{ fontSize: 48, color: 'info.main' }} />,
      path: '/website-setup/emis-management/notices',
      color: 'info.main',
      features: ['Security Alerts', 'Maintenance Windows', 'Release Notes']
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            EMIS Management System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Comprehensive management system for EMIS resources including hardware inventory, VPS server monitoring, and email reset request
            processing.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {modules.map((module) => (
            <Grid item xs={12} md={4} key={module.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, elevation 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    elevation: 8
                  }
                }}
                onClick={() => navigate(module.path)}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    {module.icon}
                    <Typography variant="h5" fontWeight="bold">
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.description}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                      {module.features.map((feature) => (
                        <Chip key={feature} label={feature} size="small" variant="outlined" sx={{ borderColor: module.color }} />
                      ))}
                    </Stack>

                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 2,
                        bgcolor: module.color,
                        '&:hover': {
                          bgcolor: module.color,
                          opacity: 0.9
                        }
                      }}
                      fullWidth
                    >
                      Access Module
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            System Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <HardwareIcon color="primary" />
                <Box>
                  <Typography variant="h6">Hardware</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete CRUD management
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <NetworkIcon color="secondary" />
                <Box>
                  <Typography variant="h6">VPS Services</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time monitoring
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <EmailIcon color="error" />
                <Box>
                  <Typography variant="h6">Email Requests</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automated workflow
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CloudIcon color="success" />
                <Box>
                  <Typography variant="h6">Cloud Ready</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scalable architecture
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
};

export default EmisManagementDashboard;
