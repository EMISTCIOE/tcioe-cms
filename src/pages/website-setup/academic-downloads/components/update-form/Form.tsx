import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateAcademicDownloads from '../../hooks/useUpdateAcademicDownloads';
import { IAcademicDownloadsDetails } from '../../redux/types';
import { TAcademicDownloadsUpdateFormDataType } from './config';

export interface IAcademicDownloadsUpdateFormProps {
  academicDownloadsData?: IAcademicDownloadsDetails;
  onClose?: () => void;
}

export default function AcademicDownloadsUpdateForm({ academicDownloadsData, onClose }: IAcademicDownloadsUpdateFormProps) {
  const { control, errors, formFields, handleSubmit } = useUpdateAcademicDownloads({ academicDownloadsData, onClose });

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Academic Download'}>
            <FormSection<TAcademicDownloadsUpdateFormDataType> fields={formFields} control={control} errors={errors} />
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
