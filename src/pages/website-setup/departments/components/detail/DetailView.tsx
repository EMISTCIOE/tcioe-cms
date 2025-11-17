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
import { IDepartment } from '../../redux/types';
import { viewDepartmentConfig } from './config';

// Component Props
interface IDetailViewProps {
  departmentData: IDepartment | undefined;
  onClose: () => void;
}

const DetailView: React.FC<IDetailViewProps> = ({ departmentData, onClose }) => {
  const theme = useTheme();

  if (!departmentData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Department Details Not Found
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  const DynamicInfoSectionProps = {
    ...viewDepartmentConfig,
    data: departmentData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      <CloseButton onClose={onClose} />

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
        <Avatar src={departmentData.thumbnail || undefined} alt={departmentData.name || 'department'} sx={{ width: 72, height: 72, mr: 3 }}>
          {departmentData?.name?.charAt(0) || 'D'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{departmentData?.name || 'Unknown Department'}</Typography>
          {departmentData.short_name && (
            <Typography variant="body2" color="text.secondary">
              {departmentData.short_name}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={departmentData.is_active ? 'success' : 'error'}
              label={departmentData.is_active ? 'Active' : 'Inactive'}
              icon={departmentData.is_active ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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

        {departmentData.detailed_description && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                pb: 1,
                mb: 2,
                borderBottom: 1,
                borderColor: 'divider',
                fontSize: 16
              }}
            >
              Detailed Description
            </Typography>
            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(departmentData.detailed_description) }} />
          </Box>
        )}
      </Box>
    </MainCard>
  );
};

export default DetailView;
