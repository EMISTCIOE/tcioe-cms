import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICampusEventsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateCampusEventsMutation } from '../redux/campusEvents.api';

import { handleClientError } from '@/utils/functions/handleError';
import { ICampusEventsCreateFormProps } from '../components/create-form';
import {
  campusEventsCreateFields,
  campusEventsCreateFormSchema,
  defaultValues,
  TCampusEventsCreateFormDataType
} from '../components/create-form/config';

const useCreateCampusEvents = ({ onClose }: ICampusEventsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createCampusEvents] = useCreateCampusEventsMutation();
  const [formFields, _] = useState(campusEventsCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TCampusEventsCreateFormDataType>({
    resolver: zodResolver(campusEventsCreateFormSchema),
    defaultValues
  });

  // NOTE - Form submit handler
  const onSubmit = async (data: TCampusEventsCreateFormDataType) => {
    try {
      const payload = { ...data } as ICampusEventsCreatePayload;
      const res = await createCampusEvents(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusEventsCreateFormDataType>({
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

export default useCreateCampusEvents;
