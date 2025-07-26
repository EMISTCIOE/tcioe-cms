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
  campusFeedbacksUpdateFields,
  campusFeedbacksUpdateFormSchema,
  defaultValues,
  TCampusFeedbacksUpdateFormDataType
} from '../components/update-form/config';
import { ICampusFeedbacksUpdateFormProps } from '../components/update-form/Form';
import { useResolveCampusFeedbacksMutation } from '../redux/campusFeedbacks.api';
import { ICampusFeedbacksUpdatePayload } from '../redux/types';

const useUpdateCampusFeedbacks = ({ campusFeedbacksData, onClose }: ICampusFeedbacksUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [resolveCampusFeedbacks] = useResolveCampusFeedbacksMutation();
  const [formFields, _] = useState(campusFeedbacksUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusFeedbacksUpdateFormDataType>({
    resolver: zodResolver(campusFeedbacksUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusFeedbacksData) {
      reset({
        id: campusFeedbacksData.id,
        isResolved: campusFeedbacksData.isResolved
      });
    }
  }, [campusFeedbacksData, reset]);

  // This is for form update not for inline update
  const onSubmit = async (data: TCampusFeedbacksUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as ICampusFeedbacksUpdatePayload
      };
      const res = await resolveCampusFeedbacks(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusFeedbacksUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar,
        fieldKeyMap: {
          isResolved: 'isResolved'
        }
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

export default useUpdateCampusFeedbacks;
