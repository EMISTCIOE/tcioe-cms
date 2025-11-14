// Package Imports
import DOMPurify from 'dompurify';

// MUI Core Imports
import { Avatar, Box, Chip, CircularProgress, Paper, Typography, useTheme } from '@mui/material';
import MainCard from '@/components/cards/MainCard';

// MUI Icons
import { CancelOutlined, CheckCircleOutline } from '@mui/icons-material';

// Project Components & Types
import CloseButton from '@/components/app-dialog/CloseButton';
import DynamicInfoSection from '@/components/detail-section';
import { ICampusUnitsDetails } from '../../redux/types';
import { viewCampusUnitsConfig } from './config';

// Component Props
interface IDetailViewProps {
  campusUnitsData: ICampusUnitsDetails | undefined;
  onClose: () => void;
}

const DetailView: React.FC<IDetailViewProps> = ({ campusUnitsData, onClose }) => {
  const theme = useTheme();

  if (!campusUnitsData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Campus Unit Details Not Found
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  const DynamicInfoSectionProps = {
    ...viewCampusUnitsConfig,
    data: campusUnitsData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      <CloseButton onClose={onClose} />

      {campusUnitsData.heroImage && (
        <Box
          sx={{
            width: '100%',
            height: { xs: 180, md: 260 },
            backgroundImage: `url(${campusUnitsData.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      <Box
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          flexDirection: { xxs: 'column', xs: 'row' },
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Avatar src={campusUnitsData.thumbnail || undefined} alt={campusUnitsData.name || 'unit'} sx={{ width: 72, height: 72, mr: 3 }}>
          {campusUnitsData?.name?.charAt(0) || 'U'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{campusUnitsData?.name || 'Unknown Unit'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={campusUnitsData.isActive ? 'success' : 'error'}
              label={campusUnitsData.isActive ? 'Active' : 'Inactive'}
              icon={campusUnitsData.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
              sx={{
                mr: 1,
                p: 1.5,
                fontWeight: 500,
                borderRadius: 1
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xxs: 0, xs: 2 }, py: 2 }}>
        <DynamicInfoSection {...DynamicInfoSectionProps} />

        {campusUnitsData.detailedDescription && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: (theme) => theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 2
              }}
            >
              Detailed Description
            </Typography>
            <Box
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(campusUnitsData.detailedDescription)
              }}
            />
          </Box>
        )}

        {campusUnitsData.objectives && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: (theme) => theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 2
              }}
            >
              Objectives
            </Typography>
            <Box
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(campusUnitsData.objectives)
              }}
            />
          </Box>
        )}

        {campusUnitsData.achievements && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: (theme) => theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 2
              }}
            >
              Key Achievements
            </Typography>
            <Box
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(campusUnitsData.achievements)
              }}
            />
          </Box>
        )}

        {campusUnitsData.departmentHeadDetail && (
          <Box sx={{ mt: 4, borderTop: 1, borderColor: 'divider', pt: 4 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 2
              }}
            >
              Department Head
            </Typography>
            <MainCard
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 3,
                p: 2,
                flex: 1,
                minWidth: 280
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar
                  src={campusUnitsData.departmentHeadDetail.photo || undefined}
                  alt={campusUnitsData.departmentHeadDetail.fullName || 'Head'}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%'
                  }}
                >
                  {campusUnitsData.departmentHeadDetail.fullName?.charAt(0) || 'H'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {campusUnitsData.departmentHeadDetail.fullName}
                  </Typography>
                  {campusUnitsData.departmentHeadDetail.titlePrefixDisplay && (
                    <Typography variant="body2" color="text.secondary">
                      {campusUnitsData.departmentHeadDetail.titlePrefixDisplay}
                    </Typography>
                  )}
                  <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
                    {campusUnitsData.departmentHeadDetail.designation || 'Head'}
                  </Typography>
                  {campusUnitsData.departmentHeadDetail.email && (
                    <Typography variant="body2" color="text.secondary">
                      {campusUnitsData.departmentHeadDetail.email}
                    </Typography>
                  )}
                  {campusUnitsData.departmentHeadDetail.phoneNumber && (
                    <Typography variant="body2" color="text.secondary">
                      {campusUnitsData.departmentHeadDetail.phoneNumber}
                    </Typography>
                  )}
                </Box>
              </Box>
            </MainCard>
          </Box>
        )}

        {campusUnitsData.officials &&
          campusUnitsData.officials.filter((official) => official.id !== campusUnitsData.departmentHeadDetail?.id).length > 0 && (
            <Box sx={{ mt: 4, borderTop: 1, borderColor: 'divider', pt: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mb: 2
                }}
              >
                Linked Staff
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {campusUnitsData.officials
                  .filter((official) => official.id !== campusUnitsData.departmentHeadDetail?.id)
                  .map((official) => (
                    <MainCard
                      key={official.uuid}
                      elevation={3}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 3,
                        p: 2,
                        flex: 1,
                        minWidth: 280
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Avatar
                          src={official.photo || undefined}
                          alt={official.fullName || 'official'}
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%'
                          }}
                        >
                          {official.fullName?.charAt(0) || 'O'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" fontWeight={600}>
                            {official.fullName || 'Member'}
                          </Typography>
                          {official.titlePrefixDisplay && (
                            <Typography variant="body2" color="text.secondary">
                              {official.titlePrefixDisplay}
                            </Typography>
                          )}
                          <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
                            {official.designation || 'Designation'}
                          </Typography>
                          {official.email && (
                            <Typography variant="body2" color="text.secondary">
                              {official.email}
                            </Typography>
                          )}
                          {official.phoneNumber && (
                            <Typography variant="body2" color="text.secondary">
                              {official.phoneNumber}
                            </Typography>
                          )}
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              size="small"
                              variant="outlined"
                              color="primary"
                              label={official.isKeyOfficial ? 'Key Staff' : 'Staff'}
                              icon={<CheckCircleOutline fontSize="small" />}
                              sx={{
                                mr: 1,
                                p: 1.2,
                                fontWeight: 500,
                                borderRadius: 1
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </MainCard>
                  ))}
              </Box>
            </Box>
          )}
      </Box>
    </MainCard>
  );
};

export default DetailView;
