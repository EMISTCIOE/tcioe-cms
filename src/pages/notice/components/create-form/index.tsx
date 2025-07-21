// MUI Imports
import { Box, Button, Grid } from '@mui/material';

// Project Imports
import MainCard from '@/components/cards/MainCard';
import useCreateNotice from '../../hooks/useCreateNotice';
import FormSection from '@/components/app-form/FormSection';
import { TNoticeCreateFormDataType } from './config';
import { useMemo } from 'react';

export interface INoticeCreateFormProps {
  onClose?: () => void;
}

export default function NoticeCreateForm({ onClose }: INoticeCreateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useCreateNotice({ onClose });
  const formValues = watch();

  const SeparatorComponent = useMemo(() => {
    return () => <Box sx={{ mt: 6, mb: 2, width: '100%', height: '2px', backgroundColor: (theme) => theme.palette.divider }} />
  }, []);
  return (
    <form onSubmit={handleSubmit()} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Create New Notice">
            <FormSection<TNoticeCreateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues}
              childrenForInput={{ 'thumbnail': <SeparatorComponent /> }}
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
