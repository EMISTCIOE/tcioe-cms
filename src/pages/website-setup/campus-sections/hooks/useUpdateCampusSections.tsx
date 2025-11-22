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
  campusSectionsUpdateFields,
  campusSectionsUpdateFormSchema,
  defaultValues,
  TCampusSectionsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusSectionsUpdateFormProps } from '../components/update-form/Form';
import { usePatchCampusSectionsMutation } from '../redux/campusSections.api';
import { ICampusSectionsUpdatePayload } from '../redux/types';
import { useGetCampusKeyOfficialsQuery } from '@/pages/website-setup/campus-key-officials/redux/campusKeyOfficials.api';

const useUpdateCampusSections = ({ campusSectionsData, onClose }: ICampusSectionsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusSections] = usePatchCampusSectionsMutation();
  const [formFields, setFormFields] = useState(campusSectionsUpdateFields);
  const { data: keyOfficialsData } = useGetCampusKeyOfficialsQuery({
    search: '',
    paginationModel: { page: 0, pageSize: 1000 },
    sortModel: [{ field: 'displayOrder', sort: 'asc' }],
    filterModel: {
      items: [{ field: 'isActive', operator: 'equals', value: 'true' }]
    }
  });

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusSectionsUpdateFormDataType>({
    resolver: zodResolver(campusSectionsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusSectionsData) {
      reset({
        id: campusSectionsData.id,
        name: campusSectionsData.name,
        slug: campusSectionsData.slug ?? '',
        shortDescription: campusSectionsData.shortDescription,
        detailedDescription: campusSectionsData.detailedDescription ?? '',
        objectives: campusSectionsData.objectives ?? '',
        achievements: campusSectionsData.achievements ?? '',
        location: campusSectionsData.location ?? '',
        contactEmail: campusSectionsData.contactEmail ?? '',
        contactPhone: campusSectionsData.contactPhone ?? '',
        displayOrder: campusSectionsData.displayOrder,
        isActive: campusSectionsData.isActive,
        thumbnail: campusSectionsData.thumbnail ?? null,
        heroImage: campusSectionsData.heroImage ?? null,
        members: campusSectionsData.members ?? [],
        departmentHead: campusSectionsData.departmentHead ?? undefined
      });
    }
  }, [campusSectionsData, reset]);

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
  const onSubmit = async (data: TCampusSectionsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as ICampusSectionsUpdatePayload
      };
      const res = await updateCampusSections(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusSectionsUpdateFormDataType>({
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

export default useUpdateCampusSections;
