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
import { useCampusUnitOptions } from '@/hooks/useCampusUnitOptions';
import { useCampusSectionOptions } from '@/hooks/useCampusSectionOptions';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

const useCreateNotice = ({ onClose }: INoticeCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createNotice] = useCreateNoticeMutation();
  const [formFields, setFormFields] = useState(noticeCreateFields);
  const { noticeCategoriesOptions } = useNoticeCategories();
  const { noticeDepartmentsOptions } = useNoticeDepartments();
  const { options: unitOptions } = useCampusUnitOptions();
  const { options: sectionOptions } = useCampusSectionOptions();
  const { roleType, campusUnitId, campusSectionId } = useAppSelector(authState);

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
      prev
        .map((field) => {
          if (field.name === 'category') {
            return { ...field, options: noticeCategoriesOptions || [] };
          }
          if (field.name === 'department') {
            return { ...field, options: noticeDepartmentsOptions || [], hidden: ['CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || '') };
          }
          if (field.name === 'campusUnit') {
            const locked = unitOptions.find((opt) => String(opt.value) === String(campusUnitId));
            return {
              ...field,
              options: locked ? [locked] : unitOptions,
              disabled: Boolean(locked),
              hidden: roleType !== 'CAMPUS-UNIT'
            };
          }
          if (field.name === 'campusSection') {
            const locked = sectionOptions.find((opt) => String(opt.value) === String(campusSectionId));
            return {
              ...field,
              options: locked ? [locked] : sectionOptions,
              disabled: Boolean(locked),
              hidden: roleType !== 'CAMPUS-SECTION'
            };
          }
          if (['isApprovedByDepartment', 'isApprovedByCampus'].includes(field.name as string)) {
            return { ...field, hidden: ['CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || '') };
          }
          return field;
        })
        .filter((field) => !field.hidden)
    );
  }, [noticeCategoriesOptions, noticeDepartmentsOptions, roleType, campusUnitId, campusSectionId, unitOptions, sectionOptions]);

  useMemo(() => {
    if (roleType === 'CAMPUS-UNIT' && campusUnitId) {
      // @ts-ignore
      control.setValue('campusUnit', Number(campusUnitId));
    }
    if (roleType === 'CAMPUS-SECTION' && campusSectionId) {
      // @ts-ignore
      control.setValue('campusSection', Number(campusSectionId));
    }
  }, [roleType, campusUnitId, campusSectionId, control]);

  // NOTE - Form submit handler
  const onSubmit = async (data: TNoticeCreateFormDataType) => {
    try {
      const payload = { ...data } as INoticeCreatePayload;
      // Ensure only scoped linkage is sent for unit/section users
      if (roleType === 'CAMPUS-UNIT') {
        payload.department = null;
        payload.campusUnit = campusUnitId ? String(campusUnitId) : null;
        payload.campusSection = null;
        payload.isApprovedByDepartment = undefined;
        payload.isApprovedByCampus = undefined;
      }
      if (roleType === 'CAMPUS-SECTION') {
        payload.department = null;
        payload.campusUnit = null;
        payload.campusSection = campusSectionId ? String(campusSectionId) : null;
        payload.isApprovedByDepartment = undefined;
        payload.isApprovedByCampus = undefined;
      }
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
