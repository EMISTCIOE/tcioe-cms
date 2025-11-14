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
  researchFacilitiesUpdateFields,
  researchFacilitiesUpdateFormSchema,
  defaultValues,
  TResearchFacilitiesUpdateFormDataType
} from '../components/update-form/config';
import { IResearchFacilitiesUpdateFormProps } from '../components/update-form/Form';
import { usePatchResearchFacilityMutation } from '../redux/researchFacilities.api';
import { IResearchFacilityUpdatePayload } from '../redux/types';

const useUpdateResearchFacilities = ({ researchFacilityData, onClose }: IResearchFacilitiesUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateResearchFacility] = usePatchResearchFacilityMutation();
  const [formFields, setFormFields] = useState(researchFacilitiesUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TResearchFacilitiesUpdateFormDataType>({
    resolver: zodResolver(researchFacilitiesUpdateFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (researchFacilityData) {
      reset({
        id: researchFacilityData.id,
        name: researchFacilityData.name,
        slug: researchFacilityData.slug ?? '',
        shortDescription: researchFacilityData.shortDescription,
        description: researchFacilityData.description ?? '',
        objectives: researchFacilityData.objectives ?? '',
        displayOrder: researchFacilityData.displayOrder,
        isActive: researchFacilityData.isActive,
        thumbnail: researchFacilityData.thumbnail ?? null
      });
    }
  }, [researchFacilityData, reset]);

  const onSubmit = async (data: TResearchFacilitiesUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as IResearchFacilityUpdatePayload
      };
      const res = await updateResearchFacility(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TResearchFacilitiesUpdateFormDataType>({
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

export default useUpdateResearchFacilities;
