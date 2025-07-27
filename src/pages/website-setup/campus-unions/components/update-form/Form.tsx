import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateCampusUnions from '../../hooks/useUpdateCampusUnions';
import { ICampusUnionsDetails } from '../../redux/types';
import { TCampusUnionsUpdateFormDataType } from './config';

export interface ICampusUnionsUpdateFormProps {
  campusUnionsData?: ICampusUnionsDetails;
  onClose?: () => void;
}

export default function CampusUnionsUpdateForm({ campusUnionsData, onClose }: ICampusUnionsUpdateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useUpdateCampusUnions({ campusUnionsData, onClose });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Campus Official'}>
            <FormSection<TCampusUnionsUpdateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
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
