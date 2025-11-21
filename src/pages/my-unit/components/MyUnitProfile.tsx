import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, CircularProgress, Box, Avatar, Chip, Paper, Fade, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

import MainCard from '@/components/cards/MainCard';
import DynamicInfoSection from '@/components/detail-section';
import FormSection from '@/components/app-form/FormSection';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { useRetrieveCampusUnitsQuery } from '@/pages/website-setup/campus-units/redux/campusUnits.api';
import { useUpdateMyUnit } from '../hooks/useUpdateMyUnit';

const MyUnitProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { campusUnitId } = useAppSelector(authState);

  const {
    data: unitData,
    isLoading,
    error,
    refetch
  } = useRetrieveCampusUnitsQuery(campusUnitId ?? null, {
    skip: !campusUnitId
  });

  const { control, errors, watch, formFields, handleSubmit, reset } = useUpdateMyUnit({
    unitData,
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
    if (unitData) {
      reset({
        id: Number(unitData.id),
        name: unitData.name,
        shortDescription: unitData.shortDescription,
        displayOrder: unitData.displayOrder,
        members: unitData.members?.map((member: any) => Number(member.id || member)) || [],
        isActive: unitData.isActive,
        slug: unitData.slug || undefined,
        detailedDescription: unitData.detailedDescription || undefined,
        objectives: unitData.objectives || undefined,
        achievements: unitData.achievements || undefined,
        thumbnail: unitData.thumbnail || undefined,
        heroImage: unitData.heroImage || undefined,
        location: unitData.location || undefined,
        contactEmail: unitData.contactEmail || undefined,
        contactPhone: unitData.contactPhone || undefined
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

  if (error || !unitData) {
    return (
      <MainCard title="My Unit">
        <Typography variant="h6" color="error" align="center">
          Unable to load unit data. Please try again later.
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
                  <Avatar src={unitData.thumbnail || undefined} alt={unitData.name} sx={{ width: 60, height: 60 }} />
                  <Box>
                    <Typography variant="h4">{unitData.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Campus Unit Profile
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
                label={unitData.isActive ? 'Active' : 'Inactive'}
                color={unitData.isActive ? 'success' : 'default'}
                variant="outlined"
              />
              {unitData.contactEmail && <Chip label={`Email: ${unitData.contactEmail}`} variant="outlined" />}
              {unitData.contactPhone && <Chip label={`Phone: ${unitData.contactPhone}`} variant="outlined" />}
            </Box>
          </MainCard>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          {isEditing ? (
            <form onSubmit={handleSubmit()}>
              <MainCard title="Edit Unit Information">
                <FormSection fields={formFields} control={control} errors={errors} formValues={watch()} />
              </MainCard>
            </form>
          ) : (
            <MainCard title="Unit Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">{unitData.shortDescription || 'No description available'}</Typography>
                  </Box>

                  {unitData.detailedDescription && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Detailed Description
                      </Typography>
                      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: unitData.detailedDescription }} />
                    </Box>
                  )}

                  {unitData.objectives && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Objectives
                      </Typography>
                      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: unitData.objectives }} />
                    </Box>
                  )}

                  {unitData.achievements && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Achievements
                      </Typography>
                      <Typography variant="body1" dangerouslySetInnerHTML={{ __html: unitData.achievements }} />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>

                  {unitData.location && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">{unitData.location}</Typography>
                    </Box>
                  )}

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Contact Email
                    </Typography>
                    <Typography variant="body1">{unitData.contactEmail || 'Not provided'}</Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Contact Phone
                    </Typography>
                    <Typography variant="body1">{unitData.contactPhone || 'Not provided'}</Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Display Order
                    </Typography>
                    <Typography variant="body1">{unitData.displayOrder}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Members Section */}
              {unitData.members && unitData.members.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Unit Members
                  </Typography>
                  <Grid container spacing={2}>
                    {unitData.members.map((member, index) => (
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

export default MyUnitProfile;
