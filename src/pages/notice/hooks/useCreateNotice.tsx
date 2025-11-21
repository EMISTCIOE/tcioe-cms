import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { zodResolver } from '@hookform/resolvers/zod';
import { INoticeCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateNoticeMutation } from '../redux/notice.api';

import { handleClientError } from '@/utils/functions/handleError';
import { useEffect, useMemo, useState } from 'react';
import { INoticeCreateFormProps } from '../components/create-form';
import { defaultValues, noticeCreateFields, noticeCreateFormSchema, TNoticeCreateFormDataType } from '../components/create-form/config';
import { useNoticeCategories } from './useNoticeCategories';
import { useNoticeDepartments } from './useNoticeDepartments';
import { useCampusUnitOptions } from '@/hooks/useCampusUnitOptions';
import { useCampusSectionOptions } from '@/hooks/useCampusSectionOptions';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { useCanAccessApprovalFields } from '@/utils/permissions/helpers';

const useCreateNotice = ({ onClose }: INoticeCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createNotice] = useCreateNoticeMutation();
  const [formFields, setFormFields] = useState(noticeCreateFields);
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
    watch,
    setValue,
    formState: { errors }
  } = useForm<TNoticeCreateFormDataType>({
    resolver: zodResolver(noticeCreateFormSchema),
    defaultValues
  });

  useMemo(() => {
    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isStudentClub = roleType === 'CLUB';
    const lockedDepartment = noticeDepartmentsOptions?.find((option) => option && String(option.value) === String(departmentId));
    const shouldLockDepartmentField = (isDepartmentAdmin || (isStudentClub && departmentId)) && Boolean(lockedDepartment);

    // Union users should not be able to create notices at all
    if (roleType === 'UNION') {
      setFormFields([]);
      return;
    }

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
            console.log('CREATE - Campus Unit field config:', {
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

          if (['isApprovedByDepartment', 'isApprovedByCampus', 'isFeatured', 'isDraft'].includes(field.name as string)) {
            return { ...field, hidden: !canAccessApprovalFields };
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
    canAccessApprovalFields,
    departmentId
  ]);

  useEffect(() => {
    // Union users should not access notice creation
    if (roleType === 'UNION') {
      return;
    }

    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isStudentClub = roleType === 'CLUB';
    const lockedDepartment = noticeDepartmentsOptions.find((opt) => opt && String(opt.value) === String(departmentId));
    const shouldLockDepartment = (isDepartmentAdmin || (isStudentClub && departmentId)) && Boolean(lockedDepartment);
    if (shouldLockDepartment && departmentId) {
      console.log('Setting department value on create:', String(departmentId));
      setValue('department', String(departmentId));
    }

    if (roleType === 'CAMPUS-UNIT' && campusUnitId) {
      console.log('Setting campus unit value on create:', String(campusUnitId));
      setValue('campusUnit', String(campusUnitId));
    }
    if (roleType === 'CAMPUS-SECTION' && campusSectionId) {
      console.log('Setting campus section value on create:', String(campusSectionId));
      setValue('campusSection', String(campusSectionId));
    }
  }, [roleType, campusUnitId, campusSectionId, setValue, departmentId, noticeDepartmentsOptions]);

  // NOTE - Form submit handler
  const onSubmit = async (data: TNoticeCreateFormDataType) => {
    try {
      // Union users cannot create notices
      if (roleType === 'UNION') {
        enqueueSnackbar('Union users cannot create notices', { variant: 'error' });
        return;
      }

      const payload = { ...data } as INoticeCreatePayload;

      // Ensure only scoped linkage is sent for unit/section users
      if (roleType === 'CAMPUS-UNIT') {
        payload.department = null;
        payload.campusUnit = campusUnitId ? String(campusUnitId) : null;
        payload.campusSection = null;
        payload.isApprovedByDepartment = false; // Campus Unit users cannot approve
        payload.isApprovedByCampus = false; // Campus Unit users cannot approve
        payload.isFeatured = false; // Campus Unit notices are not featured by default
        payload.isDraft = false; // Default to published for Unit users
      }
      if (roleType === 'CAMPUS-SECTION') {
        payload.department = null;
        payload.campusUnit = null;
        payload.campusSection = campusSectionId ? String(campusSectionId) : null;
        payload.isApprovedByDepartment = false; // Campus Section users cannot approve
        payload.isApprovedByCampus = false; // Campus Section users cannot approve
        payload.isFeatured = false; // Campus Section notices are not featured by default
        payload.isDraft = false; // Default to published for Section users
      }

      if (roleType === 'DEPARTMENT-ADMIN') {
        payload.campusUnit = null;
        payload.campusSection = null;
        if (departmentId) {
          payload.department = String(departmentId);
        }
        payload.isApprovedByDepartment = false;
        payload.isApprovedByCampus = false;
        payload.isFeatured = false;
        payload.isDraft = false;
      }

      if (roleType === 'CLUB') {
        payload.campusUnit = null;
        payload.campusSection = null;
        if (departmentId) {
          payload.department = String(departmentId);
        }
        payload.isApprovedByDepartment = false;
        payload.isApprovedByCampus = false;
        payload.isFeatured = false;
        payload.isDraft = false;
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
