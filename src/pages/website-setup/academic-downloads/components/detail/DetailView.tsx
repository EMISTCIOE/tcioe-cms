// Package Imports
import DOMPurify from 'dompurify';

// MUI Core Imports
import { Avatar, Box, Chip, CircularProgress, Paper, Typography, useTheme } from '@mui/material';

// MUI Icons
import { CancelOutlined, CheckCircleOutline, InsertDriveFile } from '@mui/icons-material';

// Project Components & Types
import MainCard from '@/components/cards/MainCard';
import { IAcademicDownloadsDetails } from '../../redux/types';
import CloseButton from '@/components/app-dialog/CloseButton';
import DynamicInfoSection from '@/components/detail-section';
import { viewAcademicDownloadsConfig } from './config';
import { useState } from 'react';
import FilePreviewDialog from '@/components/app-dialog/FilePreviewDialog';
import PdfImage from '@/assets/images/pdf.png';

// Component Props
interface IDetailViewProps {
  academicDownloadsData: IAcademicDownloadsDetails | undefined;
  onClose: () => void;
}

// Component
const DetailView: React.FC<IDetailViewProps> = ({ academicDownloadsData, onClose }) => {
  const theme = useTheme();

  if (!academicDownloadsData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Academic Download Details
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
    if (!url) return;

    setFileModalUrl(url);
    setIsCurrentFilePdf(isPdf);
    setIsFileModalOpen(true);
  };

  const handleCloseFileModal = () => {
    setIsFileModalOpen(false);
    setFileModalUrl(null);
    setIsCurrentFilePdf(false);
  };

  const isActive = (academicDownloadsData as any)?.isActive ?? (academicDownloadsData as any)?.is_active ?? false;

  const DynamicInfoSectionProps = {
    ...viewAcademicDownloadsConfig,
    data: academicDownloadsData
  };

  const isPdf = academicDownloadsData?.file?.endsWith('.pdf');
  const isImage =
    academicDownloadsData?.file?.endsWith('.png') ||
    academicDownloadsData?.file?.endsWith('.jpg') ||
    academicDownloadsData?.file?.endsWith('.jpeg') ||
    academicDownloadsData?.file?.endsWith('.gif');

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* AcademicDownloads Header */}
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
          src={isImage ? academicDownloadsData?.file : undefined}
          alt={academicDownloadsData.title || 'downloads'}
          sx={{ width: 72, height: 72, mr: 3 }}
        >
          {academicDownloadsData.title?.charAt(0) || 'D'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{academicDownloadsData?.title || 'Unknown Academic Download'}</Typography>
          {academicDownloadsData?.department && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Department: {academicDownloadsData?.department?.short_name || academicDownloadsData?.department?.name}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={isActive ? 'success' : 'error'}
              label={isActive ? 'Active' : 'Inactive'}
              icon={isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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
        {/* --- Detailed Description Section --- */}
        {academicDownloadsData?.description && (
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
              Description
            </Typography>
            <Box
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(academicDownloadsData?.description)
              }}
            />
          </Box>
        )}
        <Box sx={{ mt: 4, borderTop: 1, borderColor: 'divider', pt: 4 }}>
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
            Attached Files
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {academicDownloadsData.file ? (
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
                onClick={() => handleOpenFileModal(academicDownloadsData.file!, isPdf)}
              >
                {isImage ? (
                  <img
                    src={academicDownloadsData.file!}
                    alt={academicDownloadsData.title || 'Attached Image'}
                    style={{ width: 60, maxHeight: 60, objectFit: 'cover' }}
                  />
                ) : isPdf ? (
                  <img src={PdfImage} alt="PDF Icon" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                ) : (
                  <InsertDriveFile sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
                )}
                <Typography
                  variant="body2"
                  sx={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}
                >
                  {academicDownloadsData.title || (isPdf ? 'Document' : isImage ? 'Image' : 'File')}
                </Typography>
              </MainCard>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No attached files.
              </Typography>
            )}
          </Box>
        </Box>
        {/* --- End Files Section --- */}
      </Box>

      {/* --- File Preview Dialog --- */}
      <FilePreviewDialog open={isFileModalOpen} onClose={handleCloseFileModal} fileUrl={fileModalUrl} isPdf={isCurrentFilePdf} />
    </MainCard>
  );
};

export default DetailView;
