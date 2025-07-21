import { Box, Button, Divider, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateNotice from '../../hooks/useUpdateNotice';
import { INoticeDetails } from '../../redux/types';
import { TNoticeUpdateFormDataType } from './config';
import { useMemo } from 'react';

export interface INoticeUpdateFormProps {
  noticeData?: INoticeDetails;
  onClose?: () => void;
}

export default function NoticeUpdateForm({ noticeData, onClose }: INoticeUpdateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useUpdateNotice({ noticeData, onClose });
  const formValues = watch();

  const SeparatorComponent = useMemo(() => {
    return () => <Box sx={{ mt: 6, mb: 2, width: '100%', height: '2px', backgroundColor: (theme) => theme.palette.divider }} />
  }, []);

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Notice'}>
            <FormSection<TNoticeUpdateFormDataType> fields={formFields} formValues={formValues} control={control} errors={errors}
              childrenForInput={{ 'thumbnail': <SeparatorComponent /> }}
            />
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
