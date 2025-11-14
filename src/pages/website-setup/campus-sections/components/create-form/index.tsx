// MUI Imports
import { Button, Grid } from '@mui/material';

// Project Imports
import MainCard from '@/components/cards/MainCard';
import FormSection from '@/components/app-form/FormSection';
import { TCampusSectionsCreateFormDataType } from './config';
import useCreateCampusSections from '../../hooks/useCreateCampusSections';

export interface ICampusSectionsCreateFormProps {
  onClose?: () => void;
}

export default function CampusSectionsCreateForm({ onClose }: ICampusSectionsCreateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useCreateCampusSections({ onClose });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Create New Campus Section">
            <FormSection<TCampusSectionsCreateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
          </MainCard>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={Object.keys(errors).length > 0}>
            Create
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
