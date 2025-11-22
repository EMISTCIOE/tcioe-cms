import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';
import { useGlobalEventOptions } from '@/hooks/useGlobalEventOptions';
import { useCampusUnionOptions } from '@/hooks/useCampusUnionOptions';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';
import { useStudentClubs } from '@/pages/student-clubs-setup/student-clubs/hooks/useStudentClubs';
import { useCampusUnitOptions } from '@/hooks/useCampusUnitOptions';
import { useCampusSectionOptions } from '@/hooks/useCampusSectionOptions';
import { usePatchGlobalGalleryImageMutation } from '../redux/globalGalleryImages.api';
import {
  globalGalleryUpdateFields,
  globalGalleryUpdateFormSchema,
  galleryUpdateDefaultValues,
  TGlobalGalleryUpdateFormDataType
} from '../components/update-form/config';
import { IGlobalGalleryImage, IGlobalGalleryImageUpdatePayload } from '../redux/globalGalleryImages.types';
import { authState } from '@/pages/authentication/redux/selector';

const normalizeFile = (input: File | FileList | null | undefined) => {
  if (input instanceof FileList) {
    return input[0];
  }
  return input ?? null;
};

const toStringOrNull = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
};

const useUpdateGlobalGalleryImage = ({ imageData, onClose }: { imageData?: IGlobalGalleryImage; onClose?: () => void }) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateImage] = usePatchGlobalGalleryImageMutation();
  const [formFields, setFormFields] = useState(globalGalleryUpdateFields);
  const { options: globalEventOptions } = useGlobalEventOptions();
  const { options: unionOptions } = useCampusUnionOptions();
  const { options: departmentOptions } = useDepartmentOptions();
  const { studentClubsOptions } = useStudentClubs();
  const { options: unitOptions } = useCampusUnitOptions();
  const { options: sectionOptions } = useCampusSectionOptions();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm<TGlobalGalleryUpdateFormDataType>({
    resolver: zodResolver(globalGalleryUpdateFormSchema),
    defaultValues: galleryUpdateDefaultValues
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
          if (field.name === 'globalEvent') {
            return { ...field, options: globalEventOptions };
          }
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
              disabled: Boolean(isSection && lockedSection)
            };
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
    if (imageData) {
      reset({
        id: Number(imageData.id),
        sourceTitle: imageData.sourceTitle ?? '',
        sourceContext: imageData.sourceContext ?? '',
        globalEvent: toStringOrNull(imageData.globalEvent),
        union: toStringOrNull(imageData.union),
        club: toStringOrNull(imageData.club),
        department: toStringOrNull(imageData.department),
        unit: toStringOrNull(imageData.unit),
        section: toStringOrNull(imageData.section),
        isActive: imageData.isActive,
        caption: imageData.caption ?? '',
        displayOrder: imageData.displayOrder,
        image: imageData.image // Use the existing image URL for preview
      });
    } else {
      reset(galleryUpdateDefaultValues);
    }
  }, [imageData, reset]);

  useEffect(() => {
    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isClub = roleType === 'CLUB' && Boolean(clubId);
    if (roleType === 'UNION' && unionId && unionOptions.length > 0) {
      const unionExists = unionOptions.find((opt) => String(opt.value) === String(unionId));
      if (unionExists) {
        console.log('Setting union value for update:', String(unionId));
        setValue('union', String(unionId));
      }
    }
    if (roleType === 'CAMPUS-UNIT' && campusUnitId && unitOptions.length > 0) {
      const unitExists = unitOptions.find((opt) => String(opt.value) === String(campusUnitId));

      if (unitExists) {
        console.log('Setting unit value for update:', String(campusUnitId));
        setValue('unit', String(campusUnitId));
      }
    }
    if (roleType === 'CAMPUS-SECTION' && campusSectionId && sectionOptions.length > 0) {
      const sectionExists = sectionOptions.find((opt) => String(opt.value) === String(campusSectionId));
      if (sectionExists) {
        console.log('Setting section value for update:', String(campusSectionId), 'options:', sectionOptions);
        setValue('section', String(campusSectionId));
      }
    }
    if (isDepartmentAdmin && departmentId && departmentOptions.length > 0) {
      const departmentExists = departmentOptions.find((opt) => String(opt.value) === String(departmentId));
      if (departmentExists) {
        console.log('Setting department value for update:', String(departmentId));
        setValue('department', String(departmentId));
      }
    }
    if (isClub && clubId && studentClubsOptions.length > 0) {
      const clubExists = studentClubsOptions.find((opt) => String(opt.value) === String(clubId));
      if (clubExists) {
        console.log('Setting club value for update:', String(clubId));
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
    clubId,
    departmentOptions,
    studentClubsOptions
  ]);

  const onSubmit = async (data: TGlobalGalleryUpdateFormDataType) => {
    if (!imageData) return;
    try {
      const payload: IGlobalGalleryImageUpdatePayload = {
        globalEvent: data.globalEvent ? String(data.globalEvent) : null,
        union: data.union ? String(data.union) : null,
        club: data.club ? String(data.club) : null,
        department: data.department ? String(data.department) : null,
        unit: data.unit ? String(data.unit) : null,
        section: data.section ? String(data.section) : null,
        isActive: data.isActive,
        caption: data.caption?.trim(),
        displayOrder: data.displayOrder,
        sourceTitle: data.sourceTitle?.trim(),
        sourceContext: data.sourceContext?.trim()
      };

      // Only include image in payload if a new file was uploaded
      // If data.image is still the original URL string, don't include it
      if (data.image instanceof File) {
        const file = normalizeFile(data.image);
        if (file) {
          payload.image = file;
        }
      }

      const res = await updateImage({ id: imageData.id, values: payload }).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TGlobalGalleryUpdateFormDataType>({
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

export default useUpdateGlobalGalleryImage;
