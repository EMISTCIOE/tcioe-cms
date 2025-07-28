import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IStudentClubEventsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateStudentClubEventsMutation } from '../redux/studentClubEvents.api';

import { handleClientError } from '@/utils/functions/handleError';
import { IStudentClubEventsCreateFormProps } from '../components/create-form';
import {
  studentClubEventsCreateFields,
  studentClubEventsCreateFormSchema,
  defaultValues,
  TStudentClubEventsCreateFormDataType
} from '../components/create-form/config';
import { useStudentClubs } from './useStudentClubs';

const useCreateStudentClubEvents = ({ onClose }: IStudentClubEventsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createStudentClubEvents] = useCreateStudentClubEventsMutation();
  const [formFields, setFormFields] = useState(studentClubEventsCreateFields);
  const { studentClubsOptions } = useStudentClubs();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TStudentClubEventsCreateFormDataType>({
    resolver: zodResolver(studentClubEventsCreateFormSchema),
    defaultValues
  });

  useMemo(() => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'club') {
          return { ...field, options: studentClubsOptions || [] };
        }
        return field;
      })
    );
  }, [studentClubsOptions]);

  // NOTE - Form submit handler
  const onSubmit = async (data: TStudentClubEventsCreateFormDataType) => {
    try {
      const payload = { ...data } as IStudentClubEventsCreatePayload;
      const res = await createStudentClubEvents(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TStudentClubEventsCreateFormDataType>({
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

export default useCreateStudentClubEvents;
