import { Box, Button, Divider, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateNotice from '../../hooks/useUpdateNotice';
import { INoticeDetails } from '../../redux/types';
import { TNoticeUpdateFormDataType } from './config';

export interface INoticeUpdateFormProps {
  noticeData?: INoticeDetails;
  onClose?: () => void;
}

export default function NoticeUpdateForm({ noticeData, onClose }: INoticeUpdateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useUpdateNotice({ noticeData, onClose });
  const formValues = watch();

  return (
    <Box sx={{ width: '100%' }}>
      <form onSubmit={handleSubmit()}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <FormSection<TNoticeUpdateFormDataType> fields={formFields} formValues={formValues} control={control} errors={errors} />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
