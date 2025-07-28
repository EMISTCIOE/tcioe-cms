import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateAcademicCalendars from '../../hooks/useUpdateAcademicCalendars';
import { IAcademicCalendarsDetails } from '../../redux/types';
import { TAcademicCalendarsUpdateFormDataType } from './config';

export interface IAcademicCalendarsUpdateFormProps {
  academicCalendarsData?: IAcademicCalendarsDetails;
  onClose?: () => void;
}

export default function AcademicCalendarsUpdateForm({ academicCalendarsData, onClose }: IAcademicCalendarsUpdateFormProps) {
  const { control, errors, formFields, handleSubmit } = useUpdateAcademicCalendars({ academicCalendarsData, onClose });

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Academic Calendar'}>
            <FormSection<TAcademicCalendarsUpdateFormDataType> fields={formFields} control={control} errors={errors} />
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
