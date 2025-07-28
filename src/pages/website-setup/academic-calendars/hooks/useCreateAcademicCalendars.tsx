import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IAcademicCalendarsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateAcademicCalendarsMutation } from '../redux/academicCalendars.api';

import { handleClientError } from '@/utils/functions/handleError';
import { IAcademicCalendarsCreateFormProps } from '../components/create-form';
import {
  academicCalendarsCreateFields,
  academicCalendarsCreateFormSchema,
  defaultValues,
  TAcademicCalendarsCreateFormDataType
} from '../components/create-form/config';

const useCreateAcademicCalendars = ({ onClose }: IAcademicCalendarsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createAcademicCalendars] = useCreateAcademicCalendarsMutation();
  const [formFields, _] = useState(academicCalendarsCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TAcademicCalendarsCreateFormDataType>({
    resolver: zodResolver(academicCalendarsCreateFormSchema),
    defaultValues
  });

  // NOTE - Form submit handler
  const onSubmit = async (data: TAcademicCalendarsCreateFormDataType) => {
    try {
      const payload = { ...data } as IAcademicCalendarsCreatePayload;
      const res = await createAcademicCalendars(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TAcademicCalendarsCreateFormDataType>({
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

export default useCreateAcademicCalendars;
