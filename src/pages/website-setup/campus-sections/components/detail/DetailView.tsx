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
import { ICampusSectionsDetails } from '../../redux/types';
import { viewCampusSectionsConfig } from './config';

// Component Props
interface IDetailViewProps {
  campusSectionsData: ICampusSectionsDetails | undefined;
  onClose: () => void;
}

const DetailView: React.FC<IDetailViewProps> = ({ campusSectionsData, onClose }) => {
  const theme = useTheme();

  if (!campusSectionsData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Campus Section Details Not Found
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  const DynamicInfoSectionProps = {
    ...viewCampusSectionsConfig,
    data: campusSectionsData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      <CloseButton onClose={onClose} />

      {campusSectionsData.heroImage && (
        <Box
          sx={{
            width: '100%',
            height: { xs: 180, md: 260 },
            backgroundImage: `url(${campusSectionsData.heroImage})`,
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
        <Avatar src={campusSectionsData.thumbnail || undefined} alt={campusSectionsData.name || 'section'} sx={{ width: 72, height: 72, mr: 3 }}>
          {campusSectionsData?.name?.charAt(0) || 'S'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{campusSectionsData?.name || 'Unknown Section'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={campusSectionsData.isActive ? 'success' : 'error'}
              label={campusSectionsData.isActive ? 'Active' : 'Inactive'}
              icon={campusSectionsData.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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

        {campusSectionsData.detailedDescription && (
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
                __html: DOMPurify.sanitize(campusSectionsData.detailedDescription)
              }}
            />
          </Box>
        )}

        {campusSectionsData.objectives && (
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
                __html: DOMPurify.sanitize(campusSectionsData.objectives)
              }}
            />
          </Box>
        )}

        {campusSectionsData.achievements && (
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
                __html: DOMPurify.sanitize(campusSectionsData.achievements)
              }}
            />
          </Box>
        )}

        {campusSectionsData.members && campusSectionsData.members.length > 0 && (
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
              Section Team
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {campusSectionsData.members.map((member) => (
                <MainCard
                  key={member.id}
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
                      src={member.photo || undefined}
                      alt={member.fullName || 'member'}
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%'
                      }}
                    >
                      {member.fullName?.charAt(0) || 'M'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" fontWeight={600}>
                        {member.fullName || 'Member'}
                      </Typography>
                      <Typography variant="body1" fontWeight={400} sx={{ mb: 1 }}>
                        {member.designation || 'Designation'}
                      </Typography>
                      {member.email && (
                        <Typography variant="body2" color="text.secondary">
                          {member.email}
                        </Typography>
                      )}
                      {member.phoneNumber && (
                        <Typography variant="body2" color="text.secondary">
                          {member.phoneNumber}
                        </Typography>
                      )}
                      {member.bio && (
                        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                          {member.bio}
                        </Typography>
                      )}
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          variant="outlined"
                          color={member.isActive ? 'success' : 'error'}
                          label={member.isActive ? 'Active' : 'Inactive'}
                          icon={member.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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
