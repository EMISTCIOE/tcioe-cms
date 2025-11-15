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
  studentClubsUpdateFields,
  studentClubsUpdateFormSchema,
  defaultValues,
  Member,
  TStudentClubsUpdateFormDataType
} from '../components/update-form/config';
import { IStudentClubsUpdateFormProps } from '../components/update-form/Form';
import { useDeletStudentClubsMemberMutation, usePatchStudentClubsMutation } from '../redux/studentClubs.api';
import { IStudentClubsUpdatePayload } from '../redux/types';
import { TField } from '@/components/app-form/types';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';

const useUpdateStudentClubs = ({ studentClubsData, onClose }: IStudentClubsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateStudentClubs] = usePatchStudentClubsMutation();
  const [deleteStudentClubsMemberItem] = useDeletStudentClubsMemberMutation();
  const [formFields, setFormFields] = useState(studentClubsUpdateFields);
  const { options: departmentOptions } = useDepartmentOptions();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TStudentClubsUpdateFormDataType>({
    resolver: zodResolver(studentClubsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (studentClubsData) {
      reset({
        ...studentClubsData
      });
    }
  }, [studentClubsData, reset]);

  // delete handler for member item
  const handleDeleteMemberItem = async (index: number, member_id: number | undefined) => {
    if (!studentClubsData?.id || !member_id) return;

    try {
      const res = await deleteStudentClubsMemberItem({ id: studentClubsData.id, member_id }).unwrap();
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
  }, [studentClubsData]);

  useEffect(() => {
    setFormFields((prev) => prev.map((field) => (field.name === 'department' ? { ...field, options: departmentOptions } : field)));
  }, [departmentOptions]);

  // This is for form update not for inline update
  const onSubmit = async (data: TStudentClubsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as IStudentClubsUpdatePayload
      };
      const res = await updateStudentClubs(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TStudentClubsUpdateFormDataType>({
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

export default useUpdateStudentClubs;
