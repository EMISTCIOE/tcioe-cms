import { Button, Grid } from '@mui/material';
import MainCard from '@/components/cards/MainCard';
import FormSection from '@/components/app-form/FormSection';
import useUpdateGlobalGalleryImage from '@/pages/website-setup/global-gallery/hooks/useUpdateGlobalGalleryImage';
import { IGlobalGalleryImage } from '../../redux/globalGalleryImages.types';
import { TGlobalGalleryUpdateFormDataType } from './config';

export interface IGlobalGalleryUpdateFormProps {
  imageData?: IGlobalGalleryImage;
  onClose?: () => void;
}

export default function GlobalGalleryUpdateForm({ imageData, onClose }: IGlobalGalleryUpdateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useUpdateGlobalGalleryImage({
    imageData,
    onClose
  });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title="Update Gallery Collection">
            <FormSection<TGlobalGalleryUpdateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
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
