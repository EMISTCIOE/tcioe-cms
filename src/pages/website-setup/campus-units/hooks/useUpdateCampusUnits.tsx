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
  campusUnitsUpdateFields,
  campusUnitsUpdateFormSchema,
  defaultValues,
  TCampusUnitsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusUnitsUpdateFormProps } from '../components/update-form/Form';
import { usePatchCampusUnitsMutation } from '../redux/campusUnits.api';
import { ICampusUnitsUpdatePayload } from '../redux/types';
import { useGetCampusKeyOfficialsQuery } from '@/pages/website-setup/campus-key-officials/redux/campusKeyOfficials.api';

const useUpdateCampusUnits = ({ campusUnitsData, onClose }: ICampusUnitsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusUnits] = usePatchCampusUnitsMutation();
  const [formFields, setFormFields] = useState(campusUnitsUpdateFields);
  const { data: keyOfficialsData } = useGetCampusKeyOfficialsQuery({
    search: '',
    paginationModel: { page: 0, pageSize: 1000 },
    sortModel: [{ field: 'displayOrder', sort: 'asc' }],
    filterModel: {
      items: [
        { field: 'isActive', operator: 'equals', value: 'true' },
        { field: 'isKeyOfficial', operator: 'equals', value: 'true' }
      ]
    }
  });

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusUnitsUpdateFormDataType>({
    resolver: zodResolver(campusUnitsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusUnitsData) {
      reset({
        id: campusUnitsData.id,
        name: campusUnitsData.name,
        slug: campusUnitsData.slug ?? '',
        shortDescription: campusUnitsData.shortDescription,
        detailedDescription: campusUnitsData.detailedDescription ?? '',
        objectives: campusUnitsData.objectives ?? '',
        achievements: campusUnitsData.achievements ?? '',
        location: campusUnitsData.location ?? '',
        contactEmail: campusUnitsData.contactEmail ?? '',
        contactPhone: campusUnitsData.contactPhone ?? '',
        displayOrder: campusUnitsData.displayOrder,
        isActive: campusUnitsData.isActive,
        thumbnail: campusUnitsData.thumbnail ?? null,
        heroImage: campusUnitsData.heroImage ?? null,
        members: campusUnitsData.members ?? [],
        departmentHead: campusUnitsData.departmentHead ?? undefined
      });
    }
  }, [campusUnitsData, reset]);

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

  // This is for form update not for inline update
  const onSubmit = async (data: TCampusUnitsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as ICampusUnitsUpdatePayload
      };
      const res = await updateCampusUnits(payload).unwrap();
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
    formFields
  };
};

export default useUpdateCampusUnits;
