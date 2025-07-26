// Package Imports
import DOMPurify from 'dompurify';

// MUI Core Imports
import { Avatar, Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';

// MUI Icons
import { CancelOutlined, CheckCircleOutline } from '@mui/icons-material';

// Project Components & Types
import MainCard from '@/components/cards/MainCard';
import { ICampusFeedbacksDetails } from '../../redux/types';
import CloseButton from '@/components/app-dialog/CloseButton';
import DynamicInfoSection from '@/components/detail-section';
import { viewCampusFeedbacksConfig } from './config';

// Component Props
interface IDetailViewProps {
  campusFeedbacksData: ICampusFeedbacksDetails | undefined;
  onClose: () => void;
}

// Component
const DetailView: React.FC<IDetailViewProps> = ({ campusFeedbacksData, onClose }) => {
  if (!campusFeedbacksData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          No Campus Feedbacks Data Available
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  const DynamicInfoSectionProps = {
    ...viewCampusFeedbacksConfig,
    data: campusFeedbacksData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* CampusFeedbacks Header */}
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
        <Avatar src={undefined} alt={campusFeedbacksData.fullName || 'user'} sx={{ width: 72, height: 72, mr: 3 }}>
          {campusFeedbacksData.fullName?.charAt(0) || 'U'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{campusFeedbacksData?.fullName || 'Unknown CampusFeedbacks'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={campusFeedbacksData.isResolved ? 'success' : 'error'}
              label={campusFeedbacksData.isResolved ? 'Resolved' : 'Unresolved'}
              icon={campusFeedbacksData.isResolved ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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
        {campusFeedbacksData.message && (
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
                __html: DOMPurify.sanitize(campusFeedbacksData.message)
              }}
            />
          </Box>
        )}
      </Box>
    </MainCard>
  );
};

export default DetailView;
