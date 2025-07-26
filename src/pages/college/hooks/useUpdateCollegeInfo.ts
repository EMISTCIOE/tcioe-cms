import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useAppDispatch } from '@/libs/hooks';
import { useUpdateCollegeInfoMutation } from '../redux/college-info.api';
import { ICampusInfoUpdatePayload } from '../redux/types';

export const useUpdateCollegeInfo = (onSuccess?: () => void) => {
  const [updateCollege] = useUpdateCollegeInfoMutation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ICampusInfoUpdatePayload>();

  const onSubmit = async (data: ICampusInfoUpdatePayload) => {
    try {
      await updateCollege(data).unwrap();
      enqueueSnackbar('College info updated successfully', { variant: 'success' });
      onSuccess?.();
    } catch (error) {
      enqueueSnackbar('Failed to update college info', { variant: 'error' });
    }
  };

  return {
    control,
    handleSubmit: () => handleSubmit(onSubmit),
    errors,
    reset
  };
};