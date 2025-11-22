import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICampusSectionsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateCampusSectionsMutation } from '../redux/campusSections.api';
import { useGetCampusKeyOfficialsQuery } from '@/pages/website-setup/campus-key-officials/redux/campusKeyOfficials.api';

import { handleClientError } from '@/utils/functions/handleError';
import { ICampusSectionsCreateFormProps } from '../components/create-form';
import {
  campusSectionsCreateFields,
  campusSectionsCreateFormSchema,
  defaultValues,
  TCampusSectionsCreateFormDataType
} from '../components/create-form/config';

const useCreateCampusSections = ({ onClose }: ICampusSectionsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createCampusSections] = useCreateCampusSectionsMutation();
  const [formFields, setFormFields] = useState(campusSectionsCreateFields);
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
    formState: { errors }
  } = useForm<TCampusSectionsCreateFormDataType>({
    resolver: zodResolver(campusSectionsCreateFormSchema),
    defaultValues
  });

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

  // NOTE - Form submit handler
  const onSubmit = async (data: TCampusSectionsCreateFormDataType) => {
    try {
      const payload = { ...data } as ICampusSectionsCreatePayload;
      const res = await createCampusSections(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusSectionsCreateFormDataType>({
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

export default useCreateCampusSections;
