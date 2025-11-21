// PACKAGE IMPORTS
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// PROJECT IMPORTS
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';

// LOCAL IMPORTS
import {
  academicDownloadsUpdateFields,
  academicDownloadsUpdateFormSchema,
  defaultValues,
  TAcademicDownloadsUpdateFormDataType
} from '../components/update-form/config';
import { IAcademicDownloadsUpdateFormProps } from '../components/update-form/Form';
import { usePatchAcademicDownloadsMutation } from '../redux/academicDownloads.api';
import { IAcademicDownloadsUpdatePayload } from '../redux/types';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';

const useUpdateAcademicDownloads = ({ academicDownloadsData, onClose }: IAcademicDownloadsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateAcademicDownloads] = usePatchAcademicDownloadsMutation();
  const [formFields, setFormFields] = useState(academicDownloadsUpdateFields);
  const { options: departmentOptions } = useDepartmentOptions();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TAcademicDownloadsUpdateFormDataType>({
    resolver: zodResolver(academicDownloadsUpdateFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (departmentOptions.length) {
      setFormFields((previous) =>
        previous.map((field) => (field.name === 'department' ? { ...field, options: departmentOptions } : field))
      );
    }
  }, [departmentOptions]);

  // Reset form with data when it's available
  useEffect(() => {
    if (academicDownloadsData) {
      const isActive = (academicDownloadsData as any)?.isActive ?? (academicDownloadsData as any)?.is_active ?? false;
      reset({
        ...academicDownloadsData,
        id: academicDownloadsData.id ? String(academicDownloadsData.id) : '',
        isActive,
        department: academicDownloadsData.department?.id ? String(academicDownloadsData.department.id) : ''
      });
    }
  }, [academicDownloadsData, reset]);

  // This is for form update not for inline update
  const onSubmit = async (data: TAcademicDownloadsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as IAcademicDownloadsUpdatePayload
      };
      const res = await updateAcademicDownloads(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TAcademicDownloadsUpdateFormDataType>({
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
    formFields
  };
};

export default useUpdateAcademicDownloads;
