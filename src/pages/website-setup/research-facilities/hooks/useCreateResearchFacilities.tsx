import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IResearchFacilityCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateResearchFacilitiesMutation } from '../redux/researchFacilities.api';

import { handleClientError } from '@/utils/functions/handleError';
import { IResearchFacilitiesCreateFormProps } from '../components/create-form';
import {
  researchFacilitiesCreateFields,
  researchFacilitiesCreateFormSchema,
  defaultValues,
  TResearchFacilitiesCreateFormDataType
} from '../components/create-form/config';

const useCreateResearchFacilities = ({ onClose }: IResearchFacilitiesCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createResearchFacility] = useCreateResearchFacilitiesMutation();
  const [formFields] = useState(researchFacilitiesCreateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TResearchFacilitiesCreateFormDataType>({
    resolver: zodResolver(researchFacilitiesCreateFormSchema),
    defaultValues
  });

  const onSubmit = async (data: TResearchFacilitiesCreateFormDataType) => {
    try {
      const payload = data as IResearchFacilityCreatePayload;
      const res = await createResearchFacility(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TResearchFacilitiesCreateFormDataType>({
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

export default useCreateResearchFacilities;
