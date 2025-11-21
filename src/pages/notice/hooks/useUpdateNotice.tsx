// PACKAGE IMPORTS
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

// PROJECT IMPORTS
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';
import { useCanAccessApprovalFields } from '@/utils/permissions/helpers';
import { authState } from '@/pages/authentication/redux/selector';
import { useCampusUnitOptions } from '@/hooks/useCampusUnitOptions';
import { useCampusSectionOptions } from '@/hooks/useCampusSectionOptions';

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
  const { options: unitOptions } = useCampusUnitOptions();
  const { options: sectionOptions } = useCampusSectionOptions();
  const { roleType, campusUnitId, campusSectionId, departmentId } = useAppSelector(authState);
  const canAccessApprovalFields = useCanAccessApprovalFields();

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<TNoticeUpdateFormDataType>({
    resolver: zodResolver(noticeUpdateFormSchema),
    defaultValues
  });

  // Reset form with category data when it's available
  useEffect(() => {
    if (
      noticeData &&
      ((roleType === 'CAMPUS-UNIT' && unitOptions.length > 0) ||
        (roleType === 'CAMPUS-SECTION' && sectionOptions.length > 0) ||
        !['CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || ''))
    ) {
      // For Campus Unit users, always use their campusUnitId
      // For Campus Section users, always use their campusSectionId
      let campusUnitValue = (noticeData as any).campusUnit?.id ?? null;
      let campusSectionValue = (noticeData as any).campusSection?.id ?? null;

      if (roleType === 'CAMPUS-UNIT' && campusUnitId) {
        campusUnitValue = String(campusUnitId);
      }
      if (roleType === 'CAMPUS-SECTION' && campusSectionId) {
        campusSectionValue = String(campusSectionId);
      }

      console.log('Resetting notice form with data:', {
        campusUnitValue,
        campusSectionValue,
        roleType,
        unitOptionsLength: unitOptions.length,
        sectionOptionsLength: sectionOptions.length,
        noticeData: noticeData
      });

      reset({
        ...noticeData,
        status: noticeData.status || NoticeStatus.DRAFT,
        category: noticeData.category?.id ?? null,
        department: noticeData.department?.id ?? null,
        campusUnit: campusUnitValue,
        campusSection: campusSectionValue,
        medias: noticeData.medias ?? undefined,
        isDraft: noticeData.status === NoticeStatus.DRAFT
      });
    }
  }, [noticeData, reset, roleType, campusUnitId, campusSectionId, unitOptions.length, sectionOptions.length]);

  useMemo(() => {
    // Wait for options to be loaded for Campus Unit/Section users
    if (roleType === 'CAMPUS-UNIT' && unitOptions.length === 0) {
      return;
    }
    if (roleType === 'CAMPUS-SECTION' && sectionOptions.length === 0) {
      return;
    }

    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isStudentClub = roleType === 'CLUB';
    const lockedDepartment = noticeDepartmentsOptions.find(
      (option) => option && String(option.value) === String(departmentId)
    );
    const shouldLockDepartmentField = (isDepartmentAdmin || (isStudentClub && departmentId)) && Boolean(lockedDepartment);

    setFormFields((prev) =>
      prev
        .map((field) => {
          if (field.name === 'category') {
            return { ...field, options: noticeCategoriesOptions || [] };
          }
          if (field.name === 'department') {
            return {
              ...field,
              options: shouldLockDepartmentField && lockedDepartment ? [lockedDepartment] : noticeDepartmentsOptions || [],
              hidden: ['CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || ''),
              disabled: Boolean(shouldLockDepartmentField && lockedDepartment)
            };
          }
          if (field.name === 'campusUnit') {
            const locked = unitOptions.find((opt) => String(opt.value) === String(campusUnitId));
            const fieldOptions = locked && roleType === 'CAMPUS-UNIT' ? [locked] : unitOptions;
            console.log('Campus Unit field config:', {
              locked,
              roleType,
              campusUnitId,
              unitOptions,
              fieldOptions,
              field: field.name
            });
            return {
              ...field,
              options: fieldOptions,
              disabled: Boolean(locked) && roleType === 'CAMPUS-UNIT',
              hidden: !['ADMIN', 'EMIS-STAFF', 'CAMPUS-UNIT'].includes(roleType || '')
            };
          }
          if (field.name === 'campusSection') {
            const locked = sectionOptions.find((opt) => String(opt.value) === String(campusSectionId));
            return {
              ...field,
              options: locked && roleType === 'CAMPUS-SECTION' ? [locked] : sectionOptions,
              disabled: Boolean(locked) && roleType === 'CAMPUS-SECTION',
              hidden: !['ADMIN', 'EMIS-STAFF', 'CAMPUS-SECTION'].includes(roleType || '')
            };
          }
          return field;
        })
        .filter((field) => !(field as any).hidden)
    );
  }, [
    noticeCategoriesOptions,
    noticeDepartmentsOptions,
    roleType,
    campusUnitId,
    campusSectionId,
    unitOptions,
    sectionOptions,
    departmentId
  ]);

  // Filter approval fields based on user permissions
  useMemo(() => {
    if (!canAccessApprovalFields) {
      // Remove approval fields for Campus Unit/Section users
      setFormFields((prev) =>
        prev.filter((field) => !['isFeatured', 'isApprovedByDepartment', 'isApprovedByCampus'].includes(field.name as string))
      );
    }
  }, [canAccessApprovalFields]);

  // Ensure Campus Unit/Section users have their unit/section selected once options are loaded
  useEffect(() => {
    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isStudentClub = roleType === 'CLUB';

    if (roleType === 'CAMPUS-UNIT' && campusUnitId && unitOptions.length > 0) {
      const currentValue = watch('campusUnit');
      const expectedValue = String(campusUnitId);
      if (!currentValue || currentValue !== expectedValue) {
        console.log('Setting campus unit value:', expectedValue, 'for options:', unitOptions);
        setValue('campusUnit', expectedValue);
      }
    }
    if (roleType === 'CAMPUS-SECTION' && campusSectionId && sectionOptions.length > 0) {
      const currentValue = watch('campusSection');
      const expectedValue = String(campusSectionId);
      if (!currentValue || currentValue !== expectedValue) {
        console.log('Setting campus section value:', expectedValue, 'for options:', sectionOptions);
        setValue('campusSection', expectedValue);
      }
    }
    if ((isDepartmentAdmin || (isStudentClub && departmentId)) && departmentId && noticeDepartmentsOptions.length > 0) {
      const currentDepartmentValue = watch('department');
      const expectedDepartmentValue = String(departmentId);
      if (!currentDepartmentValue || currentDepartmentValue !== expectedDepartmentValue) {
        console.log('Setting department value:', expectedDepartmentValue);
        setValue('department', expectedDepartmentValue);
      }
    }
  }, [
    roleType,
    campusUnitId,
    campusSectionId,
    unitOptions,
    sectionOptions,
    watch,
    setValue,
    departmentId,
    noticeDepartmentsOptions
  ]);

  const handleDeleteMedia = async (index: number, media_id?: string) => {
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
      const payloadValues = { ...values } as INoticeUpdatePayload;

      if (roleType === 'DEPARTMENT-ADMIN') {
        payloadValues.campusUnit = null;
        payloadValues.campusSection = null;
        if (departmentId) {
          payloadValues.department = String(departmentId);
        }
        payloadValues.isApprovedByDepartment = false;
        payloadValues.isApprovedByCampus = false;
        payloadValues.isFeatured = false;
        payloadValues.isDraft = false;
      }

      if (roleType === 'CLUB') {
        payloadValues.campusUnit = null;
        payloadValues.campusSection = null;
        if (departmentId) {
          payloadValues.department = String(departmentId);
        }
        payloadValues.isApprovedByDepartment = false;
        payloadValues.isApprovedByCampus = false;
        payloadValues.isFeatured = false;
        payloadValues.isDraft = false;
      }

      const payload = {
        id,
        values: payloadValues
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

export default useUpdateNotice;
