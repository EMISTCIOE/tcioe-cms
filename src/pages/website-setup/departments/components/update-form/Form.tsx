import { Button, Grid } from '@mui/material';

// UI Components
import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import useUpdateDepartment from '../../hooks/useUpdateDepartment';
import { IDepartment } from '../../redux/types';
import { TDepartmentUpdateFormDataType } from './config';

export interface IDepartmentUpdateFormProps {
  departmentData?: IDepartment;
  onClose?: () => void;
}

export default function DepartmentUpdateForm({ departmentData, onClose }: IDepartmentUpdateFormProps) {
  const { control, errors, watch, formFields, handleSubmit } = useUpdateDepartment({ departmentData, onClose });
  const formValues = watch();

  return (
    <form onSubmit={handleSubmit()}>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <MainCard divider title={'Update Department'}>
            <FormSection<TDepartmentUpdateFormDataType> fields={formFields} control={control} errors={errors} formValues={formValues} />
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
