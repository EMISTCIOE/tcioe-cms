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
  campusInfoUpdateFields,
  campusInfoUpdateFormSchema,
  defaultValues,
  Media,
  TCampusInfoUpdateFormDataType
} from '../components/config';
import { ICampusInfoUpdateFormProps } from '../components/updateForm';
import { useDeleteSocialLinkMutation, useUpdateCampusInfoMutation } from '../redux/campusInfo.api';
import { TField } from '@/components/app-form/types';

const useUpdateCampusInfo = ({ campusInfoData }: ICampusInfoUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusInfo] = useUpdateCampusInfoMutation();
  const [deleteSocialLink] = useDeleteSocialLinkMutation();
  const [formFields, setFormFields] = useState(campusInfoUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusInfoUpdateFormDataType>({
    resolver: zodResolver(campusInfoUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusInfoData) {
      reset({
        ...campusInfoData
      });
    }
  }, [campusInfoData, reset]);

  // delete handler for social links
  const handleDeleteSocialLink = async (id?: string) => {
    if (!id) return;

    try {
      const res = await deleteSocialLink({ id }).unwrap();
      enqueueSnackbar(res.message, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete social link', { variant: 'error' });
      console.error('Delete error:', error);
    }
  };

  // Update form fields to include delete handler for social links
  useEffect(() => {
    const updatedFields = formFields.map((f) =>
      f.name === 'socialLinks'
        ? {
            ...f,
            onDelete: (index: number, field: TField<Media>) => handleDeleteSocialLink(field?.id)
          }
        : f
    );
    setFormFields(updatedFields);
  }, [campusInfoData]);

  // This is for form update not for inline update
  const onSubmit = async (values: TCampusInfoUpdateFormDataType) => {
    try {
      const res = await updateCampusInfo(values).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
    } catch (error) {
      handleClientError<TCampusInfoUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar
      });
    }
  };

  const handleCancel = () => {
    if (campusInfoData) {
      reset({
        ...campusInfoData
      });
    }
  };

  return {
    handleSubmit: () => handleSubmit(onSubmit),
    control,
    errors,
    watch,
    formFields,
    handleCancel
  };
};

export default useUpdateCampusInfo;
