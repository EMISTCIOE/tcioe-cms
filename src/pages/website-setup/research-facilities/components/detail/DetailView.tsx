import DOMPurify from 'dompurify';
import { Avatar, Box, Chip, Typography, useTheme } from '@mui/material';
import MainCard from '@/components/cards/MainCard';
import CloseButton from '@/components/app-dialog/CloseButton';
import DynamicInfoSection from '@/components/detail-section';
import { IResearchFacilityDetails } from '../../redux/types';
import { viewResearchFacilitiesConfig } from './config';

interface IDetailViewProps {
  researchFacilityData?: IResearchFacilityDetails;
  onClose: () => void;
}

export default function DetailView({ researchFacilityData, onClose }: IDetailViewProps) {
  const theme = useTheme();

  if (!researchFacilityData) {
    return (
      <MainCard>
        <Typography variant="h6">Research facility details are unavailable.</Typography>
      </MainCard>
    );
  }

  const infoProps = {
    ...viewResearchFacilitiesConfig,
    data: researchFacilityData
  };

  return (
    <MainCard sx={{ overflow: 'hidden', position: 'relative' }}>
      <CloseButton onClose={onClose} />

      {researchFacilityData.thumbnail && (
        <Box
          sx={{
            width: '100%',
            height: { xs: 200, md: 280 },
            backgroundImage: `url(${researchFacilityData.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Avatar src={researchFacilityData.thumbnail || undefined} variant="rounded" sx={{ width: 64, height: 64 }}>
            {researchFacilityData.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              {researchFacilityData.name}
            </Typography>
            <Chip
              label={researchFacilityData.isActive ? 'Active' : 'Inactive'}
              color={researchFacilityData.isActive ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>

        <DynamicInfoSection {...infoProps} />

        {researchFacilityData.description && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.secondary }}
            >
              Description
            </Typography>
            <Box
              sx={{ mt: 1 }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(researchFacilityData.description) }}
            />
          </Box>
        )}

        {researchFacilityData.objectives && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.palette.text.secondary }}
            >
              Objectives
            </Typography>
            <Box
              sx={{ mt: 1 }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(researchFacilityData.objectives) }}
            />
          </Box>
        )}
      </Box>
    </MainCard>
  );
}
