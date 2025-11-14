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
  Member,
  TCampusSectionsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusSectionsUpdateFormProps } from '../components/update-form/Form';
import { useDeletCampusSectionsMemberMutation, usePatchCampusSectionsMutation } from '../redux/campusSections.api';
import { ICampusSectionsUpdatePayload } from '../redux/types';
import { TField } from '@/components/app-form/types';

const useUpdateCampusSections = ({ campusSectionsData, onClose }: ICampusSectionsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusSections] = usePatchCampusSectionsMutation();
  const [deleteCampusSectionsMemberItem] = useDeletCampusSectionsMemberMutation();
  const [formFields, setFormFields] = useState(campusSectionsUpdateFields);

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
        ...campusSectionsData
      });
    }
  }, [campusSectionsData, reset]);

  // delete handler for member item
  const handleDeleteMemberItem = async (index: number, member_id: number | undefined) => {
    if (!campusSectionsData?.id || !member_id) return;

    try {
      const res = await deleteCampusSectionsMemberItem({ id: campusSectionsData.id, member_id }).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
    } catch (error) {
      dispatch(setMessage({ message: 'Failed to delete media', variant: 'error' }));
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    const updatedFields = formFields.map((f) =>
      f.name === 'members'
        ? {
            ...f,
            onDelete: (index: number, field: TField<Member>) => handleDeleteMemberItem(index, field?.id)
          }
        : f
    );
    setFormFields(updatedFields);
  }, [campusSectionsData]);

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
