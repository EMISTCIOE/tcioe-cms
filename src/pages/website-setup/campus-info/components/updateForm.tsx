import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateCampusInfo from '../hooks/useUpdateCampusInfo';
import { ICampusInfo } from '../redux/types';
import { TCampusInfoUpdateFormDataType } from './config';

export interface ICampusInfoUpdateFormProps {
  campusInfoData?: ICampusInfo;
}

export default function CampusInfoUpdateForm({ campusInfoData }: ICampusInfoUpdateFormProps) {
  const { control, errors, watch, formFields, handleSubmit, handleCancel } = useUpdateCampusInfo({ campusInfoData });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Campus Information'}>
            <FormSection<TCampusInfoUpdateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
          </MainCard>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error" onClick={handleCancel}>
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
