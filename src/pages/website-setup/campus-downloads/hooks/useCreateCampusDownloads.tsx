import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICampusDownloadsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateCampusDownloadsMutation } from '../redux/campusDownloads.api';

import { handleClientError } from '@/utils/functions/handleError';
import { ICampusDownloadsCreateFormProps } from '../components/create-form';
import {
  campusDownloadsCreateFields,
  campusDownloadsCreateFormSchema,
  defaultValues,
  TCampusDownloadsCreateFormDataType
} from '../components/create-form/config';
import { title } from 'process';

const useCreateCampusDownloads = ({ onClose }: ICampusDownloadsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createCampusDownloads] = useCreateCampusDownloadsMutation();
  const [formFields, _] = useState(campusDownloadsCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TCampusDownloadsCreateFormDataType>({
    resolver: zodResolver(campusDownloadsCreateFormSchema),
    defaultValues
  });

  // NOTE - Form submit handler
  const onSubmit = async (data: TCampusDownloadsCreateFormDataType) => {
    try {
      const payload = { ...data } as ICampusDownloadsCreatePayload;
      const res = await createCampusDownloads(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusDownloadsCreateFormDataType>({
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

export default useCreateCampusDownloads;
