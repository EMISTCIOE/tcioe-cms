import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateCampusFeedbacks from '../../hooks/useUpdateCampusFeedbacks';
import { ICampusFeedbacksDetails } from '../../redux/types';
import { TCampusFeedbacksUpdateFormDataType } from './config';

export interface ICampusFeedbacksUpdateFormProps {
  campusFeedbacksData?: ICampusFeedbacksDetails;
  onClose?: () => void;
}

export default function CampusFeedbacksUpdateForm({ campusFeedbacksData, onClose }: ICampusFeedbacksUpdateFormProps) {
  const { control, errors, formFields, handleSubmit } = useUpdateCampusFeedbacks({ campusFeedbacksData, onClose });

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Resolved Status'}>
            <FormSection<TCampusFeedbacksUpdateFormDataType> fields={formFields} control={control} errors={errors} />
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
