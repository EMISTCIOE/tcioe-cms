// Package Imports
import { useState } from 'react';

// MUI Core Imports
import { Avatar, Box, Chip, CircularProgress, Paper, Typography, useTheme } from '@mui/material';
import MainCard from '@/components/cards/MainCard';

// MUI Icons
import { CancelOutlined, CheckCircleOutline, InsertDriveFile } from '@mui/icons-material';

// Project Components & Types
import FilePreviewDialog from '@/components/app-dialog/FilePreviewDialog';
import CloseButton from '@/components/app-dialog/CloseButton';
import DynamicInfoSection from '@/components/detail-section';
import { ICampusReportsDetails } from '../../redux/types';
import { viewCampusReportsConfig } from './config';
import PdfImage from '@/assets/images/pdf.png';

// Component Props
interface IDetailViewProps {
  campusReportsData: ICampusReportsDetails | undefined;
  onClose: () => void;
}

// Component
const DetailView: React.FC<IDetailViewProps> = ({ campusReportsData, onClose }) => {
  const theme = useTheme();

  if (!campusReportsData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Campus Reports Details Not Found
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  // --- State for the File Preview Modal ---
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [fileModalUrl, setFileModalUrl] = useState<string | null>(null);
  const [isCurrentFilePdf, setIsCurrentFilePdf] = useState(false);

  const handleOpenFileModal = (url: string, isPdf: boolean) => {
    setFileModalUrl(url);
    setIsCurrentFilePdf(isPdf);
    setIsFileModalOpen(true);
  };

  const handleCloseFileModal = () => {
    setIsFileModalOpen(false);
    setFileModalUrl(null);
    setIsCurrentFilePdf(false);
  };

  const DynamicInfoSectionProps = {
    ...viewCampusReportsConfig,
    data: campusReportsData
  };

  const isPdf = campusReportsData.file.endsWith('.pdf');
  const isImage =
    campusReportsData.file.endsWith('.png') ||
    campusReportsData.file.endsWith('.jpg') ||
    campusReportsData.file.endsWith('.jpeg') ||
    campusReportsData.file.endsWith('.gif');

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* CampusReports Header */}
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
        <Avatar src={undefined} alt={campusReportsData.reportType || 'Campus Report'} sx={{ width: 72, height: 72, mr: 3 }}>
          {campusReportsData?.reportType?.charAt(0) || 'R'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{campusReportsData?.reportType || 'Unknown CampusReports'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={campusReportsData.isActive ? 'success' : 'error'}
              label={campusReportsData.isActive ? 'Active' : 'Inactive'}
              icon={campusReportsData.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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
        {/* --- File section --- */}
        <Box sx={{ mt: 4, pt: 4 }}>
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
            File section
          </Typography>
          <MainCard
            sx={{
              width: '160px',
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              },
              minWidth: '120px',
              maxWidth: '150px',
              textAlign: 'center'
            }}
            onClick={() => handleOpenFileModal(campusReportsData.file!, isPdf)}
          >
            {isImage ? (
              <img
                src={campusReportsData.file!}
                alt={campusReportsData.file || 'Attached Image'}
                style={{ width: 60, maxHeight: 60, objectFit: 'cover' }}
              />
            ) : isPdf ? (
              <img src={PdfImage} alt="PDF Icon" style={{ width: 60, height: 60, objectFit: 'cover' }} />
            ) : (
              <InsertDriveFile sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
            )}
          </MainCard>
        </Box>
      </Box>

      {/* --- File Preview Dialog --- */}
      <FilePreviewDialog open={isFileModalOpen} onClose={handleCloseFileModal} fileUrl={fileModalUrl} isPdf={isCurrentFilePdf} />
    </MainCard>
  );
};

export default DetailView;
