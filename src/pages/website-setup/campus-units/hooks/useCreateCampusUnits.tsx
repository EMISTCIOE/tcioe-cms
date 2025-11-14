import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICampusUnitsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateCampusUnitsMutation } from '../redux/campusUnits.api';

import { handleClientError } from '@/utils/functions/handleError';
import { ICampusUnitsCreateFormProps } from '../components/create-form';
import {
  campusUnitsCreateFields,
  campusUnitsCreateFormSchema,
  defaultValues,
  TCampusUnitsCreateFormDataType
} from '../components/create-form/config';

const useCreateCampusUnits = ({ onClose }: ICampusUnitsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createCampusUnits] = useCreateCampusUnitsMutation();
  const [formFields, _] = useState(campusUnitsCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TCampusUnitsCreateFormDataType>({
    resolver: zodResolver(campusUnitsCreateFormSchema),
    defaultValues
  });

  // NOTE - Form submit handler
  const onSubmit = async (data: TCampusUnitsCreateFormDataType) => {
    try {
      const payload = { ...data } as ICampusUnitsCreatePayload;
      const res = await createCampusUnits(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusUnitsCreateFormDataType>({
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

export default useCreateCampusUnits;
