import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICampusKeyOfficialsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateCampusKeyOfficialsMutation } from '../redux/campusKeyOfficials.api';

import { handleClientError } from '@/utils/functions/handleError';
import { ICampusKeyOfficialsCreateFormProps } from '../components/create-form';
import {
  campusKeyOfficialsCreateFields,
  campusKeyOfficialsCreateFormSchema,
  defaultValues,
  TCampusKeyOfficialsCreateFormDataType
} from '../components/create-form/config';

const useCreateCampusKeyOfficials = ({ onClose }: ICampusKeyOfficialsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createCampusKeyOfficials] = useCreateCampusKeyOfficialsMutation();
  const [formFields, _] = useState(campusKeyOfficialsCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TCampusKeyOfficialsCreateFormDataType>({
    resolver: zodResolver(campusKeyOfficialsCreateFormSchema),
    defaultValues
  });

  // NOTE - Form submit handler
  const onSubmit = async (data: TCampusKeyOfficialsCreateFormDataType) => {
    try {
      const payload = { ...data } as ICampusKeyOfficialsCreatePayload;
      const res = await createCampusKeyOfficials(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusKeyOfficialsCreateFormDataType>({
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

export default useCreateCampusKeyOfficials;
