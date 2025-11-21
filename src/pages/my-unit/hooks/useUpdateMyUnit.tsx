import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';
import { useGetCampusKeyOfficialsQuery } from '@/pages/website-setup/campus-key-officials/redux/campusKeyOfficials.api';
import { usePatchCampusUnitsMutation } from '@/pages/website-setup/campus-units/redux/campusUnits.api';
import {
  campusUnitsUpdateFields,
  campusUnitsUpdateFormSchema,
  TCampusUnitsUpdateFormDataType
} from '@/pages/website-setup/campus-units/components/update-form/config';
import { ICampusUnitsDetails, ICampusUnitsUpdatePayload } from '@/pages/website-setup/campus-units/redux/types';

interface UseUpdateMyUnitProps {
  unitData?: ICampusUnitsDetails;
  onClose?: () => void;
}

export const useUpdateMyUnit = ({ unitData, onClose }: UseUpdateMyUnitProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateUnit] = usePatchCampusUnitsMutation();
  const [formFields, setFormFields] = useState(campusUnitsUpdateFields);

  const { data: keyOfficialsData } = useGetCampusKeyOfficialsQuery(
    {
      search: '',
      paginationModel: { page: 0, pageSize: 1000 },
      sortModel: [{ field: 'displayOrder', sort: 'asc' }],
      filterModel: {
        items: [
          { field: 'isActive', operator: 'equals', value: 'true' },
          { field: 'isKeyOfficial', operator: 'equals', value: 'true' }
        ]
      }
    },
    {
      // Skip the API call for campus unit users to avoid 403 error
      skip: true
    }
  );

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusUnitsUpdateFormDataType>({
    resolver: zodResolver(campusUnitsUpdateFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      shortDescription: '',
      detailedDescription: '',
      objectives: '',
      achievements: '',
      location: '',
      contactEmail: '',
      contactPhone: '',
      displayOrder: 1,
      isActive: true,
      thumbnail: null,
      heroImage: null,
      members: [],
      departmentHead: undefined
    }
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (unitData) {
      reset({
        id: unitData.id,
        name: unitData.name,
        slug: unitData.slug ?? '',
        shortDescription: unitData.shortDescription,
        detailedDescription: unitData.detailedDescription ?? '',
        objectives: unitData.objectives ?? '',
        achievements: unitData.achievements ?? '',
        location: unitData.location ?? '',
        contactEmail: unitData.contactEmail ?? '',
        contactPhone: unitData.contactPhone ?? '',
        displayOrder: unitData.displayOrder,
        isActive: unitData.isActive,
        thumbnail: unitData.thumbnail ?? null,
        heroImage: unitData.heroImage ?? null,
        members: unitData.members ?? [],
        departmentHead: unitData.departmentHead ?? undefined
      });
    }
  }, [unitData, reset]);

  useEffect(() => {
    const options =
      keyOfficialsData?.results?.map((official) => ({
        value: official.id,
        label: `${official.titlePrefixDisplay ? `${official.titlePrefixDisplay} ` : ''}${official.fullName}${
          official.designationDisplay ? ` (${official.designationDisplay})` : ''
        }`
      })) ?? [];

    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'departmentHead' || field.name === 'members') {
          return { ...field, options };
        }
        return field;
      })
    );
  }, [keyOfficialsData]);

  const onSubmit = async (data: TCampusUnitsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload: ICampusUnitsUpdatePayload = {
        id,
        values: {
          ...values,
          // Remove fields that should not be updated by unit users
          slug: undefined, // Don't allow changing slug
          isActive: undefined // Don't allow deactivating their own unit
        }
      };

      const res = await updateUnit(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusUnitsUpdateFormDataType>({
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
    formFields: formFields.filter(
      (field) =>
        // Filter out fields that unit users shouldn't edit
        !['slug', 'isActive', 'displayOrder'].includes(field.name as string)
    ),
    reset
  };
};
