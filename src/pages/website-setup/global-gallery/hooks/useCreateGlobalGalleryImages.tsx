import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';
import { useCampusUnionOptions } from '@/hooks/useCampusUnionOptions';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';
import { useStudentClubs } from '@/pages/student-clubs-setup/student-clubs/hooks/useStudentClubs';
import { useGlobalEventOptions } from '@/hooks/useGlobalEventOptions';
import { useCampusUnitOptions } from '@/hooks/useCampusUnitOptions';
import { useCampusSectionOptions } from '@/hooks/useCampusSectionOptions';

import { useCreateGlobalGalleryImagesMutation } from '../redux/globalGalleryImages.api';
import {
  TGlobalGalleryCreateFormDataType,
  defaultValues,
  globalGalleryCreateFields,
  TGalleryImage,
  globalGalleryCreateFormSchema
} from '../components/create-form/config';
import { IGlobalGalleryImageCreatePayload } from '../redux/globalGalleryImages.types';
import { authState } from '@/pages/authentication/redux/selector';

const normalizeFile = (input: File | FileList | null | undefined) => {
  if (input instanceof FileList) {
    return input[0];
  }
  return input ?? null;
};

const mapImagesPayload = (images: TGalleryImage[]) =>
  images
    .map((image) => {
      const file = normalizeFile(image.image);
      if (!file) return null;
      return {
        image: file,
        caption: image.caption?.trim() || undefined,
        displayOrder: image.displayOrder
      };
    })
    .filter(Boolean) as IGlobalGalleryImageCreatePayload['images'];

const useCreateGlobalGalleryImages = ({ onClose }: { onClose?: () => void }) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createCollection] = useCreateGlobalGalleryImagesMutation();
  const [formFields, setFormFields] = useState(globalGalleryCreateFields);
  const { options: unionOptions } = useCampusUnionOptions();
  const { options: departmentOptions } = useDepartmentOptions();
  const { studentClubsOptions } = useStudentClubs();
  const { options: globalEventOptions } = useGlobalEventOptions();
  const { options: unitOptions } = useCampusUnitOptions();
  const { options: sectionOptions } = useCampusSectionOptions();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TGlobalGalleryCreateFormDataType>({
    resolver: zodResolver(globalGalleryCreateFormSchema),
    defaultValues
  });

  const { roleType, unionId, campusUnitId, campusSectionId, departmentId, clubId } = useAppSelector(authState);

  useEffect(() => {
    const isUnion = roleType === 'UNION' && Boolean(unionId);
    const isUnit = roleType === 'CAMPUS-UNIT' && Boolean(campusUnitId);
    const isSection = roleType === 'CAMPUS-SECTION' && Boolean(campusSectionId);
    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isClub = roleType === 'CLUB' && Boolean(clubId);
    const lockedUnion = unionOptions.find((option) => String(option.value) === String(unionId));
    const lockedUnit = unitOptions.find((option) => String(option.value) === String(campusUnitId));
    const lockedSection = sectionOptions.find((option) => String(option.value) === String(campusSectionId));
    const lockedDepartment = departmentOptions.find((option) => String(option.value) === String(departmentId));
    const lockedClub = studentClubsOptions.find((option) => String(option.value) === String(clubId));

    setFormFields((prev) =>
      prev
        .map((field) => {
          if (field.name === 'union') {
            return {
              ...field,
              options: isUnion && lockedUnion ? [lockedUnion] : unionOptions,
              disabled: Boolean(isUnion)
            };
          }
          if (field.name === 'club') {
            return {
              ...field,
              options: isClub && lockedClub ? [lockedClub] : studentClubsOptions,
              disabled: Boolean(isClub && lockedClub)
            };
          }
          if (field.name === 'department') {
            return {
              ...field,
              options: isDepartmentAdmin && lockedDepartment ? [lockedDepartment] : departmentOptions,
              disabled: Boolean(isDepartmentAdmin && lockedDepartment)
            };
          }
          if (field.name === 'unit') {
            return {
              ...field,
              options: isUnit && lockedUnit ? [lockedUnit] : unitOptions,
              disabled: Boolean(isUnit && lockedUnit)
            };
          }
          if (field.name === 'section') {
            return {
              ...field,
              options: isSection && lockedSection ? [lockedSection] : sectionOptions,
              disabled: Boolean(isSection)
            };
          }
          if (field.name === 'globalEvent') {
            return { ...field, options: globalEventOptions };
          }
          return field;
        })
        .filter((field) => {
          // Hide unrelated linkage fields for scoped roles
          if (isUnion && ['club', 'department', 'unit', 'section'].includes(field.name as string)) return false;
          if (isUnit && ['union', 'club', 'department', 'section', 'globalEvent'].includes(field.name as string)) return false;
          if (isSection && ['union', 'club', 'department', 'unit', 'globalEvent'].includes(field.name as string)) return false;
          if (isDepartmentAdmin && ['union', 'club', 'unit', 'section'].includes(field.name as string)) return false;
          if (isClub && ['union', 'department', 'unit', 'section'].includes(field.name as string)) return false;
          return true;
        })
    );
  }, [
    globalEventOptions,
    unionOptions,
    studentClubsOptions,
    departmentOptions,
    unitOptions,
    sectionOptions,
    roleType,
    unionId,
    campusUnitId,
    campusSectionId,
    departmentId,
    clubId
  ]);

  useEffect(() => {
    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isClub = roleType === 'CLUB' && Boolean(clubId);
    if (roleType === 'UNION' && unionId && unionOptions.length > 0) {
      const unionExists = unionOptions.find((opt) => String(opt.value) === String(unionId));
      if (unionExists) {
        console.log('Setting union value for create:', String(unionId));
        setValue('union', String(unionId));
      }
    }
    if (roleType === 'CAMPUS-UNIT' && campusUnitId && unitOptions.length > 0) {
      const unitExists = unitOptions.find((opt) => String(opt.value) === String(campusUnitId));

      if (unitExists) {
        console.log('Setting unit value for create:', String(campusUnitId));
        setValue('unit', String(campusUnitId));
      }
    }
    if (roleType === 'CAMPUS-SECTION' && campusSectionId && sectionOptions.length > 0) {
      const sectionExists = sectionOptions.find((opt) => String(opt.value) === String(campusSectionId));
      if (sectionExists) {
        console.log('Setting section value for create:', String(campusSectionId), 'options:', sectionOptions);
        setValue('section', String(campusSectionId));
      }
    }
    if (isDepartmentAdmin && departmentId && departmentOptions.length > 0) {
      const departmentExists = departmentOptions.find((opt) => String(opt.value) === String(departmentId));
      if (departmentExists) {
        console.log('Setting department value for create:', String(departmentId));
        setValue('department', String(departmentId));
      }
    }
    if (isClub && clubId && studentClubsOptions.length > 0) {
      const clubExists = studentClubsOptions.find((opt) => String(opt.value) === String(clubId));
      if (clubExists) {
        console.log('Setting club value for create:', String(clubId));
        setValue('club', String(clubId));
      }
    }
  }, [
    roleType,
    unionId,
    campusUnitId,
    campusSectionId,
    setValue,
    unionOptions,
    unitOptions,
    sectionOptions,
    departmentId,
    departmentOptions,
    studentClubsOptions,
    clubId
  ]);

  const onSubmit = async (data: TGlobalGalleryCreateFormDataType) => {
    try {
      const payload: IGlobalGalleryImageCreatePayload = {
        sourceTitle: data.sourceTitle?.trim(),
        sourceContext: data.sourceContext?.trim(),
        globalEvent: data.globalEvent ? String(data.globalEvent) : null,
        union: data.union ? String(data.union) : null,
        club: data.club ? String(data.club) : null,
        department: data.department ? String(data.department) : null,
        unit: data.unit ? String(data.unit) : null,
        section: data.section ? String(data.section) : null,
        isActive: data.isActive,
        images: mapImagesPayload(data.images)
      };

      const res = await createCollection(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TGlobalGalleryCreateFormDataType>({ error, setError, enqueueSnackbar });
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

export default useCreateGlobalGalleryImages;
