import { Button, Grid } from '@mui/material';

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
  console.log(formFields)
  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Notice'}>
            <FormSection<TNoticeUpdateFormDataType> fields={formFields} formValues={formValues} control={control} errors={errors} />
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
