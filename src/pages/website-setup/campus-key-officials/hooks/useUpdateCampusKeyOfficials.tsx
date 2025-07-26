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
  campusKeyOfficialsUpdateFields,
  campusKeyOfficialsUpdateFormSchema,
  defaultValues,
  TCampusKeyOfficialsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusKeyOfficialsUpdateFormProps } from '../components/update-form/Form';
import { usePatchCampusKeyOfficialsMutation } from '../redux/campusKeyOfficials.api';
import { ICampusKeyOfficialsUpdatePayload } from '../redux/types';

const useUpdateCampusKeyOfficials = ({ campusKeyOfficialsData, onClose }: ICampusKeyOfficialsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusKeyOfficials] = usePatchCampusKeyOfficialsMutation();
  const [formFields, _] = useState(campusKeyOfficialsUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusKeyOfficialsUpdateFormDataType>({
    resolver: zodResolver(campusKeyOfficialsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusKeyOfficialsData) {
      reset({
        ...campusKeyOfficialsData
      });
    }
  }, [campusKeyOfficialsData, reset]);

  // This is for form update not for inline update
  const onSubmit = async (data: TCampusKeyOfficialsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as ICampusKeyOfficialsUpdatePayload
      };
      const res = await updateCampusKeyOfficials(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusKeyOfficialsUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar,
        fieldKeyMap: {
          titlePrefix: 'titlePrefix',
          designation: 'designation',
          fullName: 'fullName',
          email: 'email',
          phoneNumber: 'phoneNumber',
          message: 'message',
          photo: 'photo',
          isActive: 'isActive'
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

export default useUpdateCampusKeyOfficials;
