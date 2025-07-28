// Package Imports
import DOMPurify from 'dompurify';
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
import { IStudentClubEventsDetails } from '../../redux/types';
import { viewStudentClubEventsConfig } from './config';
import PdfImage from '@/assets/images/pdf.png';

// Component Props
interface IDetailViewProps {
  studentClubEventsData: IStudentClubEventsDetails | undefined;
  onClose: () => void;
}

// Component
const DetailView: React.FC<IDetailViewProps> = ({ studentClubEventsData, onClose }) => {
  const theme = useTheme();

  if (!studentClubEventsData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Student Club Event Details Not Found
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
    ...viewStudentClubEventsConfig,
    data: studentClubEventsData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* StudentClubEvents Header */}
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
        <Avatar src={studentClubEventsData.thumbnail} alt={studentClubEventsData.title || 'event'} sx={{ width: 72, height: 72, mr: 3 }}>
          {studentClubEventsData?.title?.charAt(0) || 'E'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{studentClubEventsData?.title || 'Unknown StudentClubEvents'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={studentClubEventsData.isActive ? 'success' : 'error'}
              label={studentClubEventsData.isActive ? 'Active' : 'Inactive'}
              icon={studentClubEventsData.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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
        {/* --- Description Section --- */}
        {studentClubEventsData.description && (
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
                __html: DOMPurify.sanitize(studentClubEventsData?.description)
              }}
            />
          </Box>
        )}
        {/* --- Gallery Section --- */}
        {studentClubEventsData.gallery && studentClubEventsData.gallery.length > 0 && (
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
              Attached Media
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {studentClubEventsData.gallery.map((media) => {
                if (!media.image) return null;

                const isPdf = media.image.endsWith('.pdf');
                const isImage =
                  media.image.endsWith('.png') ||
                  media.image.endsWith('.jpg') ||
                  media.image.endsWith('.jpeg') ||
                  media.image.endsWith('.gif');

                return (
                  <MainCard
                    key={media.id}
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
                    onClick={() => handleOpenFileModal(media.image!, isPdf)}
                  >
                    {isImage ? (
                      <img
                        src={media.image!}
                        alt={media.caption || 'Attached Image'}
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
                      {media.caption || (isPdf ? 'Document' : isImage ? 'Image' : 'File')}
                    </Typography>
                    <Typography variant="caption" color="primary" sx={{ textDecoration: 'underline', fontSize: '0.65rem' }}>
                      View
                    </Typography>
                  </MainCard>
                );
              })}
            </Box>
            {studentClubEventsData.gallery.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No attached gallery images.
              </Typography>
            )}
          </Box>
        )}
        {/* --- End Gallery Section --- */}
      </Box>

      {/* --- File Preview Dialog --- */}
      <FilePreviewDialog open={isFileModalOpen} onClose={handleCloseFileModal} fileUrl={fileModalUrl} isPdf={isCurrentFilePdf} />
    </MainCard>
  );
};

export default DetailView;
