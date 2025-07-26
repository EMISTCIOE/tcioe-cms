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
  const { control, errors, formFields, handleSubmit } = useUpdateCampusInfo({ campusInfoData });

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Campus Official'}>
            <FormSection<TCampusInfoUpdateFormDataType> fields={formFields} control={control} errors={errors} />
          </MainCard>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error">
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
