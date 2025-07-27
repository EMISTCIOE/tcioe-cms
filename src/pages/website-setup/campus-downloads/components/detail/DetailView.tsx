// Package Imports
import DOMPurify from 'dompurify';

// MUI Core Imports
import { Avatar, Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';

// MUI Icons
import { CancelOutlined, CheckCircleOutline } from '@mui/icons-material';

// Project Components & Types
import MainCard from '@/components/cards/MainCard';
import { ICampusDownloadsDetails } from '../../redux/types';
import CloseButton from '@/components/app-dialog/CloseButton';
import DynamicInfoSection from '@/components/detail-section';
import { viewCampusDownloadsConfig } from './config';

// Component Props
interface IDetailViewProps {
  campusDownloadsData: ICampusDownloadsDetails | undefined;
  onClose: () => void;
}

// Component
const DetailView: React.FC<IDetailViewProps> = ({ campusDownloadsData, onClose }) => {
  if (!campusDownloadsData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Campus Downloads Officials Details
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  const DynamicInfoSectionProps = {
    ...viewCampusDownloadsConfig,
    data: campusDownloadsData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* CampusDownloads Header */}
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
        <Avatar src={campusDownloadsData.file} alt={campusDownloadsData.title || 'user'} sx={{ width: 72, height: 72, mr: 3 }}>
          {campusDownloadsData.title?.charAt(0) || 'U'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{campusDownloadsData?.title || 'Unknown CampusDownloads'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={campusDownloadsData.isActive ? 'success' : 'error'}
              label={campusDownloadsData.isActive ? 'Active' : 'Inactive'}
              icon={campusDownloadsData.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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
    </MainCard>
  );
};

export default DetailView;
