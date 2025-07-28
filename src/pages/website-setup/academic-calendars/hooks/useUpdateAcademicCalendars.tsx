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
  academicCalendarsUpdateFields,
  academicCalendarsUpdateFormSchema,
  defaultValues,
  TAcademicCalendarsUpdateFormDataType
} from '../components/update-form/config';
import { IAcademicCalendarsUpdateFormProps } from '../components/update-form/Form';
import { usePatchAcademicCalendarsMutation } from '../redux/academicCalendars.api';
import { IAcademicCalendarsUpdatePayload } from '../redux/types';

const useUpdateAcademicCalendars = ({ academicCalendarsData, onClose }: IAcademicCalendarsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateAcademicCalendars] = usePatchAcademicCalendarsMutation();
  const [formFields, _] = useState(academicCalendarsUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TAcademicCalendarsUpdateFormDataType>({
    resolver: zodResolver(academicCalendarsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (academicCalendarsData) {
      reset({
        ...academicCalendarsData
      });
    }
  }, [academicCalendarsData, reset]);

  // This is for form update not for inline update
  const onSubmit = async (data: TAcademicCalendarsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as IAcademicCalendarsUpdatePayload
      };
      const res = await updateAcademicCalendars(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TAcademicCalendarsUpdateFormDataType>({
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

export default useUpdateAcademicCalendars;
