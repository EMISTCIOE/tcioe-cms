// Package Imports
import DOMPurify from 'dompurify';

// MUI Core Imports
import { Avatar, Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';

// MUI Icons
import { CancelOutlined, CheckCircleOutline } from '@mui/icons-material';

// Project Components & Types
import MainCard from '@/components/cards/MainCard';
import { ICampusKeyOfficialsDetails } from '../../redux/types';
import CloseButton from '@/components/app-dialog/CloseButton';
import DynamicInfoSection from '@/components/detail-section';
import { viewCampusKeyOfficialsConfig } from './config';

// Component Props
interface IDetailViewProps {
  campusKeyOfficialsData: ICampusKeyOfficialsDetails | undefined;
  onClose: () => void;
}

// Component
const DetailView: React.FC<IDetailViewProps> = ({ campusKeyOfficialsData, onClose }) => {
  if (!campusKeyOfficialsData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Campus Key Officials Details
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  const DynamicInfoSectionProps = {
    ...viewCampusKeyOfficialsConfig,
    data: campusKeyOfficialsData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* CampusKeyOfficials Header */}
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
        <Avatar src={campusKeyOfficialsData.photo} alt={campusKeyOfficialsData.fullName || 'user'} sx={{ width: 72, height: 72, mr: 3 }}>
          {campusKeyOfficialsData.fullName?.charAt(0) || 'U'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{campusKeyOfficialsData?.fullName || 'Unknown CampusKeyOfficials'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={campusKeyOfficialsData.isActive ? 'success' : 'error'}
              label={campusKeyOfficialsData.isActive ? 'Active' : 'Inactive'}
              icon={campusKeyOfficialsData.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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

      {/* Dynamic Info Section */}
      <Box sx={{ px: { xxs: 0, xs: 2 }, py: 1 }}>
        <DynamicInfoSection {...DynamicInfoSectionProps} />
        {/* --- Message Section --- */}
        {campusKeyOfficialsData.message && (
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
              Message
            </Typography>
            <Box
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(campusKeyOfficialsData.message)
              }}
            />
          </Box>
        )}
      </Box>
    </MainCard>
  );
};

export default DetailView;
