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
  campusUnionsUpdateFields,
  campusUnionsUpdateFormSchema,
  defaultValues,
  Member,
  TCampusUnionsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusUnionsUpdateFormProps } from '../components/update-form/Form';
import { useDeletCampusUnionsMemberMutation, usePatchCampusUnionsMutation } from '../redux/campusUnions.api';
import { ICampusUnionsUpdatePayload } from '../redux/types';
import { TField } from '@/components/app-form/types';

const useUpdateCampusUnions = ({ campusUnionsData, onClose }: ICampusUnionsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusUnions] = usePatchCampusUnionsMutation();
  const [deleteCampusUnionsMemberItem] = useDeletCampusUnionsMemberMutation();
  const [formFields, setFormFields] = useState(campusUnionsUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusUnionsUpdateFormDataType>({
    resolver: zodResolver(campusUnionsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusUnionsData) {
      reset({
        ...campusUnionsData
      });
    }
  }, [campusUnionsData, reset]);

  // delete handler for member item
  const handleDeleteMemberItem = async (index: number, member_id: number | undefined) => {
    if (!campusUnionsData?.id || !member_id) return;

    try {
      const res = await deleteCampusUnionsMemberItem({ id: campusUnionsData.id, member_id }).unwrap();
      dispatch(setMessage({ message: res.message || 'Member deleted successfully', variant: 'success' }));
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
  }, [campusUnionsData]);

  // This is for form update not for inline update
  const onSubmit = async (data: TCampusUnionsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as ICampusUnionsUpdatePayload
      };
      const res = await updateCampusUnions(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusUnionsUpdateFormDataType>({
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

export default useUpdateCampusUnions;
