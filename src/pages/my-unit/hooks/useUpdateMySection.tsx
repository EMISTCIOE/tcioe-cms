import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';
import { useGetCampusKeyOfficialsQuery } from '@/pages/website-setup/campus-key-officials/redux/campusKeyOfficials.api';
import { usePatchCampusSectionsMutation } from '@/pages/website-setup/campus-sections/redux/campusSections.api';
import {
  campusSectionsUpdateFields,
  campusSectionsUpdateFormSchema,
  TCampusSectionsUpdateFormDataType
} from '@/pages/website-setup/campus-sections/components/update-form/config';
import { ICampusSectionsDetails, ICampusSectionsUpdatePayload } from '@/pages/website-setup/campus-sections/redux/types';

interface UseUpdateMySectionProps {
  sectionData?: ICampusSectionsDetails;
  onClose?: () => void;
}

export const useUpdateMySection = ({ sectionData, onClose }: UseUpdateMySectionProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateSection] = usePatchCampusSectionsMutation();
  const [formFields, setFormFields] = useState(campusSectionsUpdateFields);

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
      // Skip the API call for campus section users to avoid 403 error
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
  } = useForm<TCampusSectionsUpdateFormDataType>({
    resolver: zodResolver(campusSectionsUpdateFormSchema),
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
    if (sectionData) {
      reset({
        id: sectionData.id,
        name: sectionData.name,
        slug: sectionData.slug ?? '',
        shortDescription: sectionData.shortDescription,
        detailedDescription: sectionData.detailedDescription ?? '',
        objectives: sectionData.objectives ?? '',
        achievements: sectionData.achievements ?? '',
        location: sectionData.location ?? '',
        contactEmail: sectionData.contactEmail ?? '',
        contactPhone: sectionData.contactPhone ?? '',
        displayOrder: sectionData.displayOrder,
        isActive: sectionData.isActive,
        thumbnail: sectionData.thumbnail ?? null,
        heroImage: sectionData.heroImage ?? null,
        members: sectionData.members ?? [],
        departmentHead: sectionData.departmentHead ?? undefined
      });
    }
  }, [sectionData, reset]);

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

  const onSubmit = async (data: TCampusSectionsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload: ICampusSectionsUpdatePayload = {
        id,
        values: {
          ...values,
          // Remove fields that should not be updated by section users
          slug: undefined, // Don't allow changing slug
          isActive: undefined // Don't allow deactivating their own section
        }
      };

      const res = await updateSection(payload).unwrap();
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
    formFields: formFields.filter(
      (field) =>
        // Filter out fields that section users shouldn't edit
        !['slug', 'isActive', 'displayOrder'].includes(field.name as string)
    ),
    reset
  };
};
