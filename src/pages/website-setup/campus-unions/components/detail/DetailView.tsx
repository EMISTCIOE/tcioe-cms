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
import { ICampusUnionsDetails } from '../../redux/types';
import { viewCampusUnionsConfig } from './config';
import PdfImage from '@/assets/images/pdf.png';

// Component Props
interface IDetailViewProps {
  campusUnionsData: ICampusUnionsDetails | undefined;
  onClose: () => void;
}

// Component
const DetailView: React.FC<IDetailViewProps> = ({ campusUnionsData, onClose }) => {
  const theme = useTheme();

  if (!campusUnionsData) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" mb={3}>
          Campus Event Details Not Found
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

  const DynamicInfoSectionProps = {
    ...viewCampusUnionsConfig,
    data: campusUnionsData
  };

  return (
    <MainCard sx={{ p: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* CampusUnions Header */}
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
        <Avatar src={undefined} alt={campusUnionsData.name || 'union'} sx={{ width: 72, height: 72, mr: 3 }}>
          {campusUnionsData?.name?.charAt(0) || 'U'}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">{campusUnionsData?.name || 'Unknown CampusUnions'}</Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              size="small"
              variant="outlined"
              color={campusUnionsData.isActive ? 'success' : 'error'}
              label={campusUnionsData.isActive ? 'Active' : 'Inactive'}
              icon={campusUnionsData.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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
        {campusUnionsData.description && (
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
                __html: DOMPurify.sanitize(campusUnionsData?.description)
              }}
            />
          </Box>
        )}
        {/* --- Members Section --- */}
        {campusUnionsData.members && campusUnionsData.members.length > 0 && (
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
              {campusUnionsData.members.map((member) => {
                return (
                  <MainCard
                    key={member.id}
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 3,
                      p: 2
                    }}
                  >
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={member.photo}
                        alt={member.fullName || 'member'}
                        sx={{
                          width: 100,
                          height: 100,
                          mr: 3,
                          borderRadius: 100
                        }}
                        onClick={() => handleOpenFileModal(member.photo!, false)}
                      >
                        {campusUnionsData?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight={600}>
                          {member.fullName || 'member'}
                        </Typography>
                        <Typography variant="body1" fontWeight={400} sx={{ mb: 2 }}>
                          {member.designation || 'Designation'}
                        </Typography>
                        <Box>
                          <Chip
                            size="small"
                            variant="outlined"
                            color={member.isActive ? 'success' : 'error'}
                            label={member.isActive ? 'Active' : 'Inactive'}
                            icon={member.isActive ? <CheckCircleOutline fontSize="small" /> : <CancelOutlined fontSize="small" />}
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
              })}
            </Box>
          </Box>
        )}
        {campusUnionsData.members.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No attached members.
          </Typography>
        )}
        {/* --- End Members Section --- */}
      </Box>

      {/* --- File Preview Dialog --- */}
      <FilePreviewDialog open={isFileModalOpen} onClose={handleCloseFileModal} fileUrl={fileModalUrl} isPdf={isCurrentFilePdf} />
    </MainCard>
  );
};

export default DetailView;
