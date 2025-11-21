import { Button, Grid } from '@mui/material';
import MainCard from '@/components/cards/MainCard';
import FormSection from '@/components/app-form/FormSection';
import useCreateGlobalEvents from '@/pages/website-setup/global-events/hooks/useCreateGlobalEvents';
import { TGlobalEventsCreateFormDataType } from './config';

export interface IGlobalEventsCreateFormProps {
  onClose?: () => void;
}

export default function GlobalEventsCreateForm({ onClose }: IGlobalEventsCreateFormProps) {
  const { control, errors, watch, formFields, handleSubmit, isCreating } = useCreateGlobalEvents({ onClose });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Add Global Event">
            <FormSection<TGlobalEventsCreateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
          </MainCard>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={Object.keys(errors).length > 0 || isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
