// MATERIAL-UI IMPORTS
import { Button, Grid } from '@mui/material';

// PROJECT IMPORTS
import MainCard from '@/components/cards/MainCard';
import FormSection from '@/components/app-form/FormSection';
import { TGlobalGalleryCreateFormDataType } from './config';
import useCreateGlobalGalleryImages from '@/pages/website-setup/global-gallery/hooks/useCreateGlobalGalleryImages';

export interface IGlobalGalleryCreateFormProps {
  onClose?: () => void;
}

export default function GlobalGalleryCreateForm({ onClose }: IGlobalGalleryCreateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useCreateGlobalGalleryImages({ onClose });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Add Gallery Images">
            <FormSection<TGlobalGalleryCreateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
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
