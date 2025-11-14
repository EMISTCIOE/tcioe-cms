import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICampusKeyOfficialsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateCampusKeyOfficialsMutation, useGetCampusStaffDesignationsQuery } from '../redux/campusKeyOfficials.api';

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
  const { data: designationData } = useGetCampusStaffDesignationsQuery();
  const [formFields, setFormFields] = useState(campusKeyOfficialsCreateFields);

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
          isKeyOfficial: 'isKeyOfficial',
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
  useEffect(() => {
    const options =
      designationData?.results
        ?.filter((item) => item.isActive)
        .map((item) => ({
          value: item.code,
          label: item.title
        })) ?? [];

    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'designation') {
          return { ...field, options };
        }
        return field;
      })
    );
  }, [designationData]);
