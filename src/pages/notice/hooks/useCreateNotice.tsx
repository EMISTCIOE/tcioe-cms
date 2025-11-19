import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { zodResolver } from '@hookform/resolvers/zod';
import { INoticeCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateNoticeMutation } from '../redux/notice.api';

import { handleClientError } from '@/utils/functions/handleError';
import { useMemo, useState } from 'react';
import { INoticeCreateFormProps } from '../components/create-form';
import { defaultValues, noticeCreateFields, noticeCreateFormSchema, TNoticeCreateFormDataType } from '../components/create-form/config';
import { useNoticeCategories } from './useNoticeCategories';
import { useNoticeDepartments } from './useNoticeDepartments';

const useCreateNotice = ({ onClose }: INoticeCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createNotice] = useCreateNoticeMutation();
  const [formFields, setFormFields] = useState(noticeCreateFields);
  const { noticeCategoriesOptions } = useNoticeCategories();
  const { noticeDepartmentsOptions } = useNoticeDepartments();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TNoticeCreateFormDataType>({
    resolver: zodResolver(noticeCreateFormSchema),
    defaultValues
  });

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

  // NOTE - Form submit handler
  const onSubmit = async (data: TNoticeCreateFormDataType) => {
    try {
      const payload = { ...data } as INoticeCreatePayload;
      const res = await createNotice(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TNoticeCreateFormDataType>({
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
          isApprovedByDepartment: 'isApprovedByDepartment',
          isApprovedByCampus: 'isApprovedByCampus',
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

export default useCreateNotice;
