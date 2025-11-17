// PACKAGE IMPORTS
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// PROJECT IMPORTS
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';

// LOCAL IMPORTS
import {
  departmentUpdateFields,
  departmentUpdateFormSchema,
  defaultValues,
  TDepartmentUpdateFormDataType
} from '../components/update-form/config';
import type { IDepartmentUpdateFormProps } from '../components/update-form/Form';
import { usePatchDepartmentMutation } from '../redux/departments.api';
import { IDepartmentUpdatePayload } from '../redux/types';

const useUpdateDepartment = ({ departmentData, onClose }: IDepartmentUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateDepartment] = usePatchDepartmentMutation();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TDepartmentUpdateFormDataType>({
    resolver: zodResolver(departmentUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (departmentData) {
      reset({
        id: departmentData.id,
        name: departmentData.name,
        shortName: departmentData.short_name ?? '',
        slug: departmentData.slug ?? '',
        briefDescription: departmentData.brief_description ?? '',
        detailedDescription: departmentData.detailed_description ?? '',
        phoneNo: departmentData.phone_no ?? '',
        email: departmentData.email ?? '',
        isActive: departmentData.is_active,
        thumbnail: departmentData.thumbnail ?? null
      });
    }
  }, [departmentData, reset]);

  // This is for form update not for inline update
  const onSubmit = async (data: TDepartmentUpdateFormDataType) => {
    const { id, ...formValues } = data;
    try {
      // Transform camelCase to snake_case for API
      const values: IDepartmentUpdatePayload = {
        name: formValues.name,
        short_name: formValues.shortName,
        brief_description: formValues.briefDescription,
        detailed_description: formValues.detailedDescription,
        phone_no: formValues.phoneNo,
        email: formValues.email,
        thumbnail: formValues.thumbnail,
        is_active: formValues.isActive
      };
      const payload = {
        id,
        values
      };
      const res = await updateDepartment(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TDepartmentUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar
      });
    }
  };

  return {
    handleSubmit: () => handleSubmit(onSubmit),
    control,
    errors,
    watch,
    formFields: departmentUpdateFields
  };
};

export default useUpdateDepartment;
