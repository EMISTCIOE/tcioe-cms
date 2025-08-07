import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateCampusReports from '../../hooks/useUpdateCampusReports';
import { ICampusReportsDetails } from '../../redux/types';
import { TCampusReportsUpdateFormDataType } from './config';

export interface ICampusReportsUpdateFormProps {
  campusReportsData?: ICampusReportsDetails;
  onClose?: () => void;
}

export default function CampusReportsUpdateForm({ campusReportsData, onClose }: ICampusReportsUpdateFormProps) {
  const { control, errors, formFields, handleSubmit } = useUpdateCampusReports({ campusReportsData, onClose });

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Campus Report'}>
            <FormSection<TCampusReportsUpdateFormDataType> fields={formFields} control={control} errors={errors} />
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
