import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, CircularProgress, Box, Avatar, Chip, Paper, Fade, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

import MainCard from '@/components/cards/MainCard';
import DynamicInfoSection from '@/components/detail-section';
import FormSection from '@/components/app-form/FormSection';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { useRetrieveCampusSectionsQuery } from '@/pages/website-setup/campus-sections/redux/campusSections.api';
import { useUpdateMySection } from '../hooks/useUpdateMySection';

const MySectionProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { campusSectionId } = useAppSelector(authState);

  const {
    data: sectionData,
    isLoading,
    error,
    refetch
  } = useRetrieveCampusSectionsQuery(campusSectionId ?? null, {
    skip: !campusSectionId
  });

  const { control, errors, watch, formFields, handleSubmit, reset } = useUpdateMySection({
    sectionData,
    onClose: () => {
      setIsEditing(false);
      refetch();
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (sectionData) {
      reset({
        id: Number(sectionData.id),
        name: sectionData.name,
        shortDescription: sectionData.shortDescription,
        displayOrder: sectionData.displayOrder,
        members: sectionData.members?.map((member: any) => Number(member.id || member)) || [],
        isActive: sectionData.isActive,
        slug: sectionData.slug || undefined,
        detailedDescription: sectionData.detailedDescription || undefined,
        objectives: sectionData.objectives || undefined,
        achievements: sectionData.achievements || undefined,
        thumbnail: sectionData.thumbnail || undefined,
        heroImage: sectionData.heroImage || undefined,
        location: sectionData.location || undefined,
        contactEmail: sectionData.contactEmail || undefined,
        contactPhone: sectionData.contactPhone || undefined
      });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !sectionData) {
    return (
      <MainCard title="My Section">
        <Typography variant="h6" color="error" align="center">
          Unable to load section data. Please try again later.
        </Typography>
      </MainCard>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <MainCard
            title={
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Box display="flex" alignItems="center" gap={3}>
                  <Avatar src={sectionData.thumbnail || undefined} alt={sectionData.name} sx={{ width: 60, height: 60 }} />
                  <Box>
                    <Typography variant="h4">{sectionData.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Campus Section Profile
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1}>
                  {!isEditing ? (
                    <IconButton
                      onClick={handleEdit}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark'
                        },
                        ml: 2
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton
                        onClick={handleSubmit()}
                        sx={{
                          backgroundColor: 'success.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'success.dark'
                          }
                        }}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleCancel}
                        sx={{
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'error.dark'
                          }
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            }
          >
            <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
              <Chip
                label={sectionData.isActive ? 'Active' : 'Inactive'}
                color={sectionData.isActive ? 'success' : 'default'}
                variant="outlined"
              />
              {sectionData.contactEmail && <Chip label={`Email: ${sectionData.contactEmail}`} variant="outlined" />}
              {sectionData.contactPhone && <Chip label={`Phone: ${sectionData.contactPhone}`} variant="outlined" />}
            </Box>
          </MainCard>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          {isEditing ? (
            <form onSubmit={handleSubmit()}>
              <MainCard title="Edit Section Information">
                <FormSection fields={formFields} control={control} errors={errors} formValues={watch()} />
              </MainCard>
            </form>
          ) : (
            <MainCard title="Section Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">{sectionData.shortDescription || 'No description available'}</Typography>
                  </Box>

                  {sectionData.detailedDescription && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Detailed Description
                      </Typography>
                      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: sectionData.detailedDescription }} />
                    </Box>
                  )}

                  {sectionData.objectives && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Objectives
                      </Typography>
                      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: sectionData.objectives }} />
                    </Box>
                  )}

                  {sectionData.achievements && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Achievements
                      </Typography>
                      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: sectionData.achievements }} />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>

                  {sectionData.location && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">{sectionData.location}</Typography>
                    </Box>
                  )}

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Contact Email
                    </Typography>
                    <Typography variant="body1">{sectionData.contactEmail || 'Not provided'}</Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Contact Phone
                    </Typography>
                    <Typography variant="body1">{sectionData.contactPhone || 'Not provided'}</Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Display Order
                    </Typography>
                    <Typography variant="body1">{sectionData.displayOrder}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Members Section */}
              {sectionData.members && sectionData.members.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Section Members
                  </Typography>
                  <Grid container spacing={2}>
                    {sectionData.members.map((member, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar>
                                {typeof member === 'object' && member && 'fullName' in member
                                  ? (member as any).fullName?.charAt(0) || 'M'
                                  : 'M'}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1">
                                  {typeof member === 'object' && member && 'fullName' in member
                                    ? (member as any).fullName
                                    : `Member ${index + 1}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {typeof member === 'object' && member && 'designation' in member
                                    ? (member as any).designation || 'Member'
                                    : 'Member'}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </MainCard>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MySectionProfile;
