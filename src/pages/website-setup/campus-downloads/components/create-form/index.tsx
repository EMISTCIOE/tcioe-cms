// MUI Imports
import { Button, Grid } from '@mui/material';

// Project Imports
import MainCard from '@/components/cards/MainCard';
import FormSection from '@/components/app-form/FormSection';
import { TCampusDownloadsCreateFormDataType } from './config';
import useCreateCampusDownloads from '../../hooks/useCreateCampusDownloads';

export interface ICampusDownloadsCreateFormProps {
  onClose?: () => void;
}

export default function CampusDownloadsCreateForm({ onClose }: ICampusDownloadsCreateFormProps) {
  const { control, errors, formFields, handleSubmit } = useCreateCampusDownloads({ onClose });

  return (
    <form onSubmit={handleSubmit()} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Create Campus Downloads">
            <FormSection<TCampusDownloadsCreateFormDataType> fields={formFields} control={control} errors={errors} />
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
