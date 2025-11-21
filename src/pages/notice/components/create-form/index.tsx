// MUI Imports
import { Box, Button, Grid } from '@mui/material';

// Project Imports
import MainCard from '@/components/cards/MainCard';
import useCreateNotice from '../../hooks/useCreateNotice';
import FormSection from '@/components/app-form/FormSection';
import { TNoticeCreateFormDataType } from './config';

export interface INoticeCreateFormProps {
  onClose?: () => void;
}

export default function NoticeCreateForm({ onClose }: INoticeCreateFormProps) {
  const { control, errors, watch, formFields, handleSubmit, isCreating } = useCreateNotice({ onClose });
  const formValues = watch();

  return (
    <Box sx={{ width: '100%' }}>
      <form onSubmit={handleSubmit()} noValidate>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <FormSection<TNoticeCreateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={Object.keys(errors).length > 0 || isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
