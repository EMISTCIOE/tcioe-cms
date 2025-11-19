// PACKAGE IMPORTS
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

// PROJECT IMPORTS
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';

// LOCAL IMPORTS
import {
  studentClubEventsUpdateFields,
  studentClubEventsUpdateFormSchema,
  defaultValues,
  EventGallery,
  TStudentClubEventsUpdateFormDataType
} from '../components/update-form/config';
import { IStudentClubEventsUpdateFormProps } from '../components/update-form/Form';
import { useDeletStudentClubEventsgalleryMutation, usePatchStudentClubEventsMutation } from '../redux/studentClubEvents.api';
import { IStudentClubEventsUpdatePayload } from '../redux/types';
import { TField } from '@/components/app-form/types';
import { useStudentClubs } from './useStudentClubs';

const useUpdateStudentClubEvents = ({ studentClubEventsData, onClose }: IStudentClubEventsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateStudentClubEvents] = usePatchStudentClubEventsMutation();
  const [deleteStudentClubEventsGalleryItem] = useDeletStudentClubEventsgalleryMutation();
  const [formFields, setFormFields] = useState(studentClubEventsUpdateFields);
  const { studentClubsOptions } = useStudentClubs();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TStudentClubEventsUpdateFormDataType>({
    resolver: zodResolver(studentClubEventsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (studentClubEventsData) {
      reset({
        ...studentClubEventsData,
        club: studentClubEventsData?.club?.id ?? null
      });
    }
  }, [studentClubEventsData, reset]);

  useMemo(() => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'club') {
          return { ...field, options: studentClubsOptions || [] };
        }
        return field;
      })
    );
  }, [studentClubsOptions]);

  // delete handler for gallery item
  const handleDeleteGalleryItem = async (index: number, gallery_id?: string) => {
    if (!studentClubEventsData?.id || !gallery_id) return;

    try {
      const res = await deleteStudentClubEventsGalleryItem({ id: studentClubEventsData.id, gallery_id }).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
    } catch (error) {
      dispatch(setMessage({ message: 'Failed to delete media', variant: 'error' }));
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    const updatedFields = formFields.map((f) =>
      f.name === 'gallery'
        ? {
            ...f,
            onDelete: (index: number, field: TField<EventGallery>) => handleDeleteGalleryItem(index, field?.id)
          }
        : f
    );
    setFormFields(updatedFields);
  }, [studentClubEventsData]);

  // This is for form update not for inline update
  const onSubmit = async (data: TStudentClubEventsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as IStudentClubEventsUpdatePayload
      };
      const res = await updateStudentClubEvents(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TStudentClubEventsUpdateFormDataType>({
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

export default useUpdateStudentClubEvents;
