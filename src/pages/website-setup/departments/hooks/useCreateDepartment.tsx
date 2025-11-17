import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { IDepartmentCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateDepartmentMutation } from '../redux/departments.api';

import { handleClientError } from '@/utils/functions/handleError';
import type { IDepartmentCreateFormProps } from '../components/create-form/index';
import {
  departmentCreateFields,
  departmentCreateFormSchema,
  defaultValues,
  TDepartmentCreateFormDataType
} from '../components/create-form/config';

const useCreateDepartment = ({ onClose }: IDepartmentCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createDepartment] = useCreateDepartmentMutation();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TDepartmentCreateFormDataType>({
    resolver: zodResolver(departmentCreateFormSchema),
    defaultValues
  });

  // NOTE - Form submit handler
  const onSubmit = async (data: TDepartmentCreateFormDataType) => {
    try {
      // Transform camelCase to snake_case for API
      const payload: IDepartmentCreatePayload = {
        name: data.name,
        short_name: data.shortName,
        brief_description: data.briefDescription,
        detailed_description: data.detailedDescription,
        phone_no: data.phoneNo,
        email: data.email,
        thumbnail: data.thumbnail,
        is_active: data.isActive
      };
      const res = await createDepartment(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TDepartmentCreateFormDataType>({
        error,
        setError,
        enqueueSnackbar
      });
    }
  };

  return {
    control,
    errors,
    watch,
    formFields: departmentCreateFields,
    handleSubmit: () => handleSubmit(onSubmit)
  };
};

export default useCreateDepartment;
