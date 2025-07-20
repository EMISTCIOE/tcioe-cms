// MUI Imports
import { Button, Grid } from '@mui/material';

// Project Imports
import MainCard from '@/components/cards/MainCard';
import useCreateNotice from '../../hooks/useCreateNotice';
import FormSection from '@/components/app-form/FormSection';
import { TNoticeCreateFormDataType } from './config';

export interface INoticeCreateFormProps {
  onClose?: () => void;
}

export default function NoticeCreateForm({ onClose }: INoticeCreateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useCreateNotice({ onClose });
  const formValues = watch();
  console.log('NoticeCreateForm - formValues:', formValues);
  return (
    <form onSubmit={handleSubmit()} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Create New Notice">
            <FormSection<TNoticeCreateFormDataType>
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
          <Button variant="contained" type="submit" disabled={Object.keys(errors).length > 0}>
            Create
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
