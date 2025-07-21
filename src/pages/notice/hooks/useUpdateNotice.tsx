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
  defaultValues,
  Media,
  noticeUpdateFields,
  noticeUpdateFormSchema,
  TNoticeUpdateFormDataType
} from '../components/update-form/config';
import { INoticeUpdateFormProps } from '../components/update-form/Form';
import { useDeleteNoticeMediaMutation, usePatchNoticeMutation } from '../redux/notice.api';
import { useNoticeCategories } from './useNoticeCategories';
import { useNoticeDepartments } from './useNoticeDepartments';
import { INoticeUpdatePayload, NoticeStatus } from '../redux/types';
import { TField } from '@/components/app-form/types';

const useUpdateNotice = ({ noticeData, onClose }: INoticeUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateNotice] = usePatchNoticeMutation();
  const [deleteNoticeMedia] = useDeleteNoticeMediaMutation();
  const [formFields, setFormFields] = useState(noticeUpdateFields);
  const { noticeCategoriesOptions } = useNoticeCategories();
  const { noticeDepartmentsOptions } = useNoticeDepartments();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TNoticeUpdateFormDataType>({
    resolver: zodResolver(noticeUpdateFormSchema),
    defaultValues
  });

  // Reset form with category data when it's available
  useEffect(() => {
    if (noticeData) {
      reset({
        ...noticeData,
        category: noticeData.category?.id ?? null,
        department: noticeData.department?.id ?? undefined,
        medias: noticeData.medias ?? undefined,
        isDraft: noticeData.status === NoticeStatus.DRAFT
      });
    }
  }, [noticeData, reset]);

  useMemo(() => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'category') {
          return { ...field, options: noticeCategoriesOptions || [] };
        }
        if (field.name === 'department') {
          return { ...field, options: noticeDepartmentsOptions || [] };
        }
        return field;
      })
    );
  }, [noticeCategoriesOptions, noticeDepartmentsOptions]);

  const handleDeleteMedia = async (index: number, media_id: number | undefined) => {
    if (!noticeData?.id || !media_id) return;

    try {
      await deleteNoticeMedia({ id: noticeData.id, media_id }).unwrap();
      enqueueSnackbar('Media Deleted Successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete media', { variant: 'error' });
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    const updatedFields = formFields.map((f) =>
      f.name === 'medias'
        ? {
          ...f,
          onDelete: (index: number, field: TField<Media>) => handleDeleteMedia(index, field?.id)
        }
        : f
    );
    setFormFields(updatedFields);
  }, [noticeData]);

  // This is for form update not for inline update
  const onSubmit = async (data: TNoticeUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as INoticeUpdatePayload
      };
      const res = await updateNotice(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TNoticeUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar,
        fieldKeyMap: {
          title: 'title',
          department: 'department',
          category: 'category',
          thumbnail: 'thumbnail',
          isFeatured: 'isFeatured',
          isDraft: 'isDraft',
          description: 'description',
          medias: 'medias'
        }
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

export default useUpdateNotice;
