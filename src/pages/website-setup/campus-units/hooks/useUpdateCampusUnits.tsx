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
  Member,
  TCampusUnitsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusUnitsUpdateFormProps } from '../components/update-form/Form';
import { useDeletCampusUnitsMemberMutation, usePatchCampusUnitsMutation } from '../redux/campusUnits.api';
import { ICampusUnitsUpdatePayload } from '../redux/types';
import { TField } from '@/components/app-form/types';

const useUpdateCampusUnits = ({ campusUnitsData, onClose }: ICampusUnitsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusUnits] = usePatchCampusUnitsMutation();
  const [deleteCampusUnitsMemberItem] = useDeletCampusUnitsMemberMutation();
  const [formFields, setFormFields] = useState(campusUnitsUpdateFields);

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
        ...campusUnitsData
      });
    }
  }, [campusUnitsData, reset]);

  // delete handler for member item
  const handleDeleteMemberItem = async (index: number, member_id: number | undefined) => {
    if (!campusUnitsData?.id || !member_id) return;

    try {
      const res = await deleteCampusUnitsMemberItem({ id: campusUnitsData.id, member_id }).unwrap();
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
  }, [campusUnitsData]);

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
