import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICampusUnionsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateCampusUnionsMutation } from '../redux/campusUnions.api';

import { handleClientError } from '@/utils/functions/handleError';
import { ICampusUnionsCreateFormProps } from '../components/create-form';
import {
  campusUnionsCreateFields,
  campusUnionsCreateFormSchema,
  defaultValues,
  TCampusUnionsCreateFormDataType
} from '../components/create-form/config';

const useCreateCampusUnions = ({ onClose }: ICampusUnionsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createCampusUnions] = useCreateCampusUnionsMutation();
  const [formFields, setFormFields] = useState(campusUnionsCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TCampusUnionsCreateFormDataType>({
    resolver: zodResolver(campusUnionsCreateFormSchema),
    defaultValues
  });

  // NOTE - Form submit handler
  const onSubmit = async (data: TCampusUnionsCreateFormDataType) => {
    try {
      const payload = { ...data } as ICampusUnionsCreatePayload;
      const res = await createCampusUnions(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusUnionsCreateFormDataType>({
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

export default useCreateCampusUnions;
