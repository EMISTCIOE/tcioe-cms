import DOMPurify from 'dompurify';
import { useState } from 'react';

// MUI Imports
import { Close, InsertDriveFile, PictureAsPdf } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, IconButton, Paper, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';

// PROJECT IMPORTS
import DefaultImage from '@/assets/images/users/avatar-1.png';
import AppDialog from '@/components/app-dialog';
import MainCard from '@/components/cards/MainCard';
import DynamicInfoSection from '@/components/detail-section';
import { INoticeDetails } from '../../redux/types';
import { viewNoticeConfig } from './config';
import CloseButton from '@/components/app-dialog/CloseButton';
import FilePreviewDialog from '@/components/app-dialog/FilePreviewDialog';

interface IDetailViewProps {
  noticeData: INoticeDetails | undefined;
  onClose: () => void;
}

const DetailView: React.FC<IDetailViewProps> = ({ noticeData, onClose }) => {
  const theme = useTheme();

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

  if (!noticeData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Notice Details Not Found
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  const DynamicInfoSectionProps = {
    ...viewNoticeConfig,
    data: noticeData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* Header */}
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
        <Avatar src={noticeData?.thumbnail ?? DefaultImage} alt={noticeData?.title} sx={{ width: 72, height: 72, mr: 3 }}>
          {noticeData?.title?.charAt(0) || 'P'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{noticeData?.title || 'Unknown Notice'}</Typography>
        </Box>
      </Box>

      {/* Info Content */}
      <Box sx={{ px: { xxs: 0, xs: 2 }, py: 1 }}>
        <DynamicInfoSection {...DynamicInfoSectionProps} />

        {/* --- Description Section --- */}
        {noticeData.description && (
          <Box sx={{ mt: 3 }}>
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
              Description
            </Typography>
            {/* <MainCard> */}
            <Box
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(noticeData.description)
              }}
            />
            {/* </MainCard> */}
          </Box>
        )}

        {/* --- Medias Section --- */}
        {noticeData.medias && noticeData.medias.length > 0 && (
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
              {noticeData.medias.map((media) => {
                if (!media.file) return null;

                const isPdf = media.mediaType === 'DOCUMENT' && media.file.endsWith('.pdf');
                const isImage =
                  media.mediaType === 'IMAGE' &&
                  (media.file.endsWith('.png') ||
                    media.file.endsWith('.jpg') ||
                    media.file.endsWith('.jpeg') ||
                    media.file.endsWith('.gif'));

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
                    onClick={() => handleOpenFileModal(media.file!, isPdf)}
                  >
                    {isImage ? (
                      <img
                        src={media.file!}
                        alt={media.caption || 'Attached Image'}
                        style={{ width: 60, maxHeight: 60, objectFit: 'cover' }}
                      />
                    ) : isPdf ? (
                      <img src="/src/assets/images/pdf.png" alt="PDF Icon" style={{ width: 60, height: 60, objectFit: 'cover' }} />
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
            {noticeData.medias.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No attached media files.
              </Typography>
            )}
          </Box>
        )}
        {/* --- End Medias Section --- */}
      </Box>

      {/* --- File Preview Dialog --- */}
      <FilePreviewDialog open={isFileModalOpen} onClose={handleCloseFileModal} fileUrl={fileModalUrl} isPdf={isCurrentFilePdf} />
    </MainCard>
  );
};

export default DetailView;
