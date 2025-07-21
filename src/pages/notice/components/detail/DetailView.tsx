import { useState } from 'react';

// MUI Imports
import Button from '@mui/material/Button';
import { Close, InsertDriveFile, PictureAsPdf } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, IconButton, Paper, Typography, useTheme } from '@mui/material';

// PROJECT IMPORTS
import DefaultImage from '@/assets/images/users/avatar-1.png';
import DynamicInfoSection from '@/components/detail-section';
import MainCard from '@/components/cards/MainCard';
import AppDialog from '@/components/app-dialog';
import { viewNoticeConfig } from './config';
import { INoticeDetails } from '../../redux/types';

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
      <IconButton onClick={onClose} aria-label="close" size="small" sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}>
        <Close />
      </IconButton>

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

        {/* --- Medias Section --- */}
        {noticeData.medias && noticeData.medias.length > 0 && (
          <Box sx={{ mt: 3, px: { xxs: 0, xs: 2 }, borderTop: 1, borderColor: 'divider', pt: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
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
                        style={{ width: '100px', maxHeight: '100px', objectFit: 'contain' }}
                      />
                    ) : isPdf ? (
                      <PictureAsPdf sx={{ fontSize: 48, color: theme.palette.error.main }} />
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

      {/* --- AppDialog for File Preview --- */}
      <AppDialog
        open={isFileModalOpen}
        onClose={handleCloseFileModal}
        title={isCurrentFilePdf ? 'Document Preview' : 'Image Preview'}
        fullWidth
        maxWidth={'lg'}
        content={
          <Box sx={{ p: 0, height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {fileModalUrl &&
              (isCurrentFilePdf ? (
                <iframe src={fileModalUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
              ) : (
                <img src={fileModalUrl} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ))}
          </Box>
        }
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button variant="outlined" onClick={handleCloseFileModal}>
              Close
            </Button>
          </Box>
        }
      />
      {/* --------------------------------- */}
    </MainCard>
  );
};

export default DetailView;
