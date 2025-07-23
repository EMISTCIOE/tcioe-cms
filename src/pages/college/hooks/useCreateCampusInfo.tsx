import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICampusInfoCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
//import { useCreateCampusInfoMutation } from '../redux/campusInfo.api';

import { handleClientError } from '@/utils/functions/handleError';
import { useState } from 'react';
import { ICampusInfoCreateFormProps } from '../components/create-form';
import {
  defaultValues,
  campusInfoCreateFields,
  campusInfoCreateFormSchema,
  TCampusInfoCreateFormDataType
} from '../components/create-form/config';

const useCreateCampusInfo = ({ onClose }: ICampusInfoCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  //const [createCampusInfo] = useCreateCampusInfoMutation();
  const [formFields, setFormFields] = useState(campusInfoCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TCampusInfoCreateFormDataType>({
    resolver: zodResolver(campusInfoCreateFormSchema),
    defaultValues
  });

  // NOTE - Form submit handler
  const onSubmit = async (data: TCampusInfoCreateFormDataType) => {
    try {
      const payload = { ...data } as ICampusInfoCreatePayload;
      // const res = await createCampusInfo(payload).unwrap();
      dispatch(setMessage({ message: 'updated', variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusInfoCreateFormDataType>({
        error,
        setError,
        enqueueSnackbar,
        fieldKeyMap: {
          name: 'name',
          email: 'email',
          phone: 'phone',
          location: 'location',
          organizationChart: 'organizationChart'
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

export default useCreateCampusInfo;
