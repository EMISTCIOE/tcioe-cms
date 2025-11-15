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
  campusEventsUpdateFields,
  campusEventsUpdateFormSchema,
  defaultValues,
  EventGallery,
  TCampusEventsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusEventsUpdateFormProps } from '../components/update-form/Form';
import { useDeletCampusEventsgalleryMutation, usePatchCampusEventsMutation } from '../redux/campusEvents.api';
import { ICampusEventsUpdatePayload } from '../redux/types';
import { TField } from '@/components/app-form/types';
import { useCampusUnionOptions } from '@/hooks/useCampusUnionOptions';

const useUpdateCampusEvents = ({ campusEventsData, onClose }: ICampusEventsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusEvents] = usePatchCampusEventsMutation();
  const [deleteCampusEventsGalleryItem] = useDeletCampusEventsgalleryMutation();
  const [formFields, setFormFields] = useState(campusEventsUpdateFields);
  const { options: unionOptions } = useCampusUnionOptions();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusEventsUpdateFormDataType>({
    resolver: zodResolver(campusEventsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusEventsData) {
      reset({
        ...campusEventsData
      });
    }
  }, [campusEventsData, reset]);

  // delete handler for gallery item
  const handleDeleteGalleryItem = async (index: number, gallery_id: number | undefined) => {
    if (!campusEventsData?.id || !gallery_id) return;

    try {
      const res = await deleteCampusEventsGalleryItem({ id: campusEventsData.id, gallery_id }).unwrap();
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
  }, [campusEventsData]);

  useEffect(() => {
    setFormFields((prev) => prev.map((field) => (field.name === 'union' ? { ...field, options: unionOptions } : field)));
  }, [unionOptions]);

  // This is for form update not for inline update
  const onSubmit = async (data: TCampusEventsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as ICampusEventsUpdatePayload
      };
      const res = await updateCampusEvents(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusEventsUpdateFormDataType>({
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

export default useUpdateCampusEvents;
