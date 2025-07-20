// PACKAGE IMPORTS
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

// PROJECT IMPORTS
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';

// LOCAL IMPORTS
import { defaultValues, noticeUpdateFields, noticeUpdateFormSchema, TNoticeUpdateFormDataType } from '../components/update-form/config';
import { INoticeUpdateFormProps } from '../components/update-form/Form';
import { usePatchNoticeMutation } from '../redux/notice.api';
import { useNoticeCategories } from './useNoticeCategories';
import { useNoticeDepartments } from './useNoticeDepartments';
import { INoticeUpdatePayload } from '../redux/types';

const useUpdateNotice = ({ noticeData, onClose }: INoticeUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateNotice] = usePatchNoticeMutation();
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
        department: noticeData.department?.id ?? null
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
