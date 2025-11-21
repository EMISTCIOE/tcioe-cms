import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IAcademicDownloadsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateAcademicDownloadsMutation } from '../redux/academicDownloads.api';

import { handleClientError } from '@/utils/functions/handleError';
import { IAcademicDownloadsCreateFormProps } from '../components/create-form';
import {
  academicDownloadsCreateFields,
  academicDownloadsCreateFormSchema,
  defaultValues,
  TAcademicDownloadsCreateFormDataType
} from '../components/create-form/config';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';

const useCreateAcademicDownloads = ({ onClose }: IAcademicDownloadsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createAcademicDownloads] = useCreateAcademicDownloadsMutation();
  const [formFields, setFormFields] = useState(academicDownloadsCreateFields);
  const { options: departmentOptions } = useDepartmentOptions();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TAcademicDownloadsCreateFormDataType>({
    resolver: zodResolver(academicDownloadsCreateFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (departmentOptions.length) {
      setFormFields((previous) =>
        previous.map((field) => (field.name === 'department' ? { ...field, options: departmentOptions } : field))
      );
    }
  }, [departmentOptions]);

  // NOTE - Form submit handler
  const onSubmit = async (data: TAcademicDownloadsCreateFormDataType) => {
    try {
      const payload = { ...data } as IAcademicDownloadsCreatePayload;
      const res = await createAcademicDownloads(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TAcademicDownloadsCreateFormDataType>({
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

export default useCreateAcademicDownloads;
