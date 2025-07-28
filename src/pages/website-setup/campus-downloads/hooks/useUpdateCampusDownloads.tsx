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
  campusDownloadsUpdateFields,
  campusDownloadsUpdateFormSchema,
  defaultValues,
  TCampusDownloadsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusDownloadsUpdateFormProps } from '../components/update-form/Form';
import { usePatchCampusDownloadsMutation } from '../redux/campusDownloads.api';
import { ICampusDownloadsUpdatePayload } from '../redux/types';

const useUpdateCampusDownloads = ({ campusDownloadsData, onClose }: ICampusDownloadsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusDownloads] = usePatchCampusDownloadsMutation();
  const [formFields, _] = useState(campusDownloadsUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusDownloadsUpdateFormDataType>({
    resolver: zodResolver(campusDownloadsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusDownloadsData) {
      reset({
        ...campusDownloadsData
      });
    }
  }, [campusDownloadsData, reset]);

  // This is for form update not for inline update
  const onSubmit = async (data: TCampusDownloadsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as ICampusDownloadsUpdatePayload
      };
      const res = await updateCampusDownloads(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusDownloadsUpdateFormDataType>({
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

export default useUpdateCampusDownloads;
