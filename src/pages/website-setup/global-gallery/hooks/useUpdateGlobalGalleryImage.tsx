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

  const { roleType, unionId } = useAppSelector(authState);

  useEffect(() => {
    const isUnion = roleType === 'UNION' && Boolean(unionId);

    setFormFields((prev) =>
      prev
        .map((field) => {
          if (field.name === 'globalEvent') {
            return { ...field, options: globalEventOptions };
          }
          if (field.name === 'union') {
            const lockedOption = unionOptions.find((option) => String(option.value) === String(unionId));
            return {
              ...field,
              options: isUnion && lockedOption ? [lockedOption] : unionOptions,
              disabled: Boolean(isUnion)
            };
          }
          if (field.name === 'club') {
            return { ...field, options: studentClubsOptions };
          }
          if (field.name === 'department') {
            return { ...field, options: departmentOptions };
          }
          if (field.name === 'unit') {
            return { ...field, options: unitOptions };
          }
          if (field.name === 'section') {
            return { ...field, options: sectionOptions };
          }
          return field;
        })
        .filter((field) => {
          // Hide club, department, unit, and section fields for union users
          if (isUnion && (field.name === 'club' || field.name === 'department' || field.name === 'unit' || field.name === 'section')) {
            return false;
          }
          return true;
        })
    );
  }, [globalEventOptions, unionOptions, studentClubsOptions, departmentOptions, unitOptions, sectionOptions, roleType, unionId]);

  useEffect(() => {
    if (imageData) {
      reset({
        id: Number(imageData.id),
        sourceTitle: imageData.sourceTitle ?? '',
        sourceContext: imageData.sourceContext ?? '',
        globalEvent: imageData.globalEvent ? Number(imageData.globalEvent) : null,
        union: imageData.union ? Number(imageData.union) : null,
        club: imageData.club ? Number(imageData.club) : null,
        department: imageData.department ? Number(imageData.department) : null,
        unit: imageData.unit ? Number(imageData.unit) : null,
        section: imageData.section ? Number(imageData.section) : null,
        isActive: imageData.isActive,
        caption: imageData.caption ?? '',
        displayOrder: imageData.displayOrder,
        image: undefined
      });
    } else {
      reset(galleryUpdateDefaultValues);
    }
  }, [imageData, reset]);

  useEffect(() => {
    if (roleType === 'UNION' && unionId) {
      setValue('union', Number(unionId));
    }
  }, [roleType, unionId, setValue]);

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

      const file = normalizeFile(data.image);
      if (file) {
        payload.image = file;
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
