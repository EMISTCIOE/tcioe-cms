import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateStudentClubEvents from '../../hooks/useUpdateStudentClubEvents';
import { IStudentClubEventsDetails } from '../../redux/types';
import { TStudentClubEventsUpdateFormDataType } from './config';

export interface IStudentClubEventsUpdateFormProps {
  studentClubEventsData?: IStudentClubEventsDetails;
  onClose?: () => void;
}

export default function StudentClubEventsUpdateForm({ studentClubEventsData, onClose }: IStudentClubEventsUpdateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useUpdateStudentClubEvents({ studentClubEventsData, onClose });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Campus Event'}>
            <FormSection<TStudentClubEventsUpdateFormDataType>
              fields={formFields}
              control={control}
              errors={errors}
              formValues={formValues}
            />
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
