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
import { campusInfoUpdateFields, campusInfoUpdateFormSchema, defaultValues, TCampusInfoUpdateFormDataType } from '../components/config';
import { ICampusInfoUpdateFormProps } from '../components/updateForm';
import { useUpdateCampusInfoMutation } from '../redux/campusInfo.api';

const useUpdateCampusInfo = ({ campusInfoData }: ICampusInfoUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusInfo] = useUpdateCampusInfoMutation();
  const [formFields, _] = useState(campusInfoUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusInfoUpdateFormDataType>({
    resolver: zodResolver(campusInfoUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusInfoData) {
      reset({
        ...campusInfoData
      });
    }
  }, [campusInfoData, reset]);

  // This is for form update not for inline update
  const onSubmit = async (values: TCampusInfoUpdateFormDataType) => {
    try {
      const res = await updateCampusInfo(values).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
    } catch (error) {
      handleClientError<TCampusInfoUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar,
        fieldKeyMap: {
          name: 'name',
          email: 'email',
          phoneNumber: 'phoneNumber',
          location: 'location',
          organizationChart: 'organizationChart',
          socialLinks: 'socialLinks'
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

export default useUpdateCampusInfo;
