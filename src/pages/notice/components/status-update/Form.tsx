import { Box, Button, Divider, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateNoticeStatus from '../../hooks/useUpdateNoticeStatus';
import { INoticeDetails } from '../../redux/types';
import { TNoticeStatusUpdateFormDataType } from './config';

export interface INoticeStatusUpdateFormProps {
  noticeData?: INoticeDetails;
  onClose?: () => void;
}

export default function NoticeStatusUpdateForm({ noticeData, onClose }: INoticeStatusUpdateFormProps) {
  const { control, errors, formFields, handleSubmit } = useUpdateNoticeStatus({ noticeData, onClose });

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Notice Status'}>
            <FormSection<TNoticeStatusUpdateFormDataType> fields={formFields} control={control} errors={errors} />
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
