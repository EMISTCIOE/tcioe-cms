import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateCampusDownloads from '../../hooks/useUpdateCampusDownloads';
import { ICampusDownloadsDetails } from '../../redux/types';
import { TCampusDownloadsUpdateFormDataType } from './config';

export interface ICampusDownloadsUpdateFormProps {
  campusDownloadsData?: ICampusDownloadsDetails;
  onClose?: () => void;
}

export default function CampusDownloadsUpdateForm({ campusDownloadsData, onClose }: ICampusDownloadsUpdateFormProps) {
  const { control, errors, formFields, handleSubmit } = useUpdateCampusDownloads({ campusDownloadsData, onClose });

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Campus Downloads'}>
            <FormSection<TCampusDownloadsUpdateFormDataType> fields={formFields} control={control} errors={errors} />
          </MainCard>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
