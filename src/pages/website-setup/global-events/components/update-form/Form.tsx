import { Button, Grid } from '@mui/material';
import MainCard from '@/components/cards/MainCard';
import FormSection from '@/components/app-form/FormSection';
import useUpdateGlobalEvents from '@/pages/website-setup/global-events/hooks/useUpdateGlobalEvents';
import type { IGlobalEventsDetails } from '../../redux/globalEvents.types';

interface IGlobalEventsUpdateFormProps {
  eventData?: IGlobalEventsDetails;
  onClose?: () => void;
}

export default function GlobalEventsUpdateForm({ eventData, onClose }: IGlobalEventsUpdateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useUpdateGlobalEvents({ eventData, onClose });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Edit Global Event">
            <FormSection
              fields={formFields}
              control={control}
              errors={errors}
              formValues={formValues}
            />
          </MainCard>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}
        >
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={Object.keys(errors).length > 0}>
            Update
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
