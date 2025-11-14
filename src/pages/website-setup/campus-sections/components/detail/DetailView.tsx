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
  const departmentHead = campusSectionsData.departmentHeadDetail;
  const memberOfficials = campusSectionsData.officials?.filter((official) => !departmentHead || official.id !== departmentHead.id) || [];

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
        <Avatar
          src={campusSectionsData.thumbnail || undefined}
          alt={campusSectionsData.name || 'section'}
          sx={{ width: 72, height: 72, mr: 3 }}
        >
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

        {departmentHead && (
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
              Section Head
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
                  src={departmentHead.photo || undefined}
                  alt={departmentHead.fullName || 'Section Head'}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%'
                  }}
                >
                  {departmentHead.fullName?.charAt(0) || 'H'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {departmentHead.fullName}
                  </Typography>
                  {departmentHead.titlePrefixDisplay && (
                    <Typography variant="body2" color="text.secondary">
                      {departmentHead.titlePrefixDisplay}
                    </Typography>
                  )}
                  <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
                    {departmentHead.designation || 'Head'}
                  </Typography>
                  {departmentHead.email && (
                    <Typography variant="body2" color="text.secondary">
                      {departmentHead.email}
                    </Typography>
                  )}
                  {departmentHead.phoneNumber && (
                    <Typography variant="body2" color="text.secondary">
                      {departmentHead.phoneNumber}
                    </Typography>
                  )}
                </Box>
              </Box>
            </MainCard>
          </Box>
        )}

        {memberOfficials.length > 0 && (
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
              {memberOfficials.map((official) => (
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
