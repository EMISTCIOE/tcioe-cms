import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreatePhoneNumberMutation } from '../redux/contact.api';

import { handleClientError } from '@/utils/functions/handleError';
import { IPhoneNumberCreateFormProps } from '../components/create-form/index';
import {
  phoneNumberCreateFields,
  phoneNumberCreateFormSchema,
  defaultValues,
  TPhoneNumberCreateFormDataType
} from '../components/create-form/config';

const useCreatePhoneNumber = ({ onClose }: IPhoneNumberCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createPhoneNumber, { isLoading }] = useCreatePhoneNumberMutation();
  const [formFields, _] = useState(phoneNumberCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TPhoneNumberCreateFormDataType>({
    resolver: zodResolver(phoneNumberCreateFormSchema),
    defaultValues
  });

  const handleCreatePhoneNumber = async (data: TPhoneNumberCreateFormDataType) => {
    try {
      const response = await createPhoneNumber(data).unwrap();
      dispatch(setMessage({ message: response.message, type: 'success' }));
      enqueueSnackbar(response.message, { variant: 'success' });
      if (onClose) onClose();
    } catch (error: any) {
      handleClientError({ error, setError, enqueueSnackbar });
    }
  };

  return {
    control,
    errors,
    watch,
    formFields,
    isLoading,
    handleSubmit: () => handleSubmit(handleCreatePhoneNumber)
  };
};

export default useCreatePhoneNumber;
