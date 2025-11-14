// MUI Imports
import { Button, Grid } from '@mui/material';

// Project Imports
import MainCard from '@/components/cards/MainCard';
import FormSection from '@/components/app-form/FormSection';
import { TPhoneNumberCreateFormDataType } from './config';
import useCreatePhoneNumber from '../../hooks/useCreatePhoneNumber';

export interface IPhoneNumberCreateFormProps {
  onClose?: () => void;
}

export default function PhoneNumberCreateForm({ onClose }: IPhoneNumberCreateFormProps) {
  const { control, errors, watch, formFields, handleSubmit, isLoading } = useCreatePhoneNumber({ onClose });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Create New Phone Number">
            <FormSection<TPhoneNumberCreateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
          </MainCard>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Phone Number'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
