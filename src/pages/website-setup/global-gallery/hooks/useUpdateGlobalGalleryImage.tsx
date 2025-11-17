import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/libs/hooks';
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
    formState: { errors }
  } = useForm<TGlobalGalleryUpdateFormDataType>({
    resolver: zodResolver(globalGalleryUpdateFormSchema),
    defaultValues: galleryUpdateDefaultValues
  });

  useEffect(() => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'globalEvent') {
          return { ...field, options: globalEventOptions };
        }
        if (field.name === 'union') {
          return { ...field, options: unionOptions };
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
    );
  }, [globalEventOptions, unionOptions, studentClubsOptions, departmentOptions, unitOptions, sectionOptions]);

  useEffect(() => {
    if (imageData) {
      reset({
        id: imageData.id,
        sourceTitle: imageData.sourceTitle ?? '',
        sourceContext: imageData.sourceContext ?? '',
        globalEvent: imageData.globalEvent ?? null,
        union: imageData.union ?? null,
        club: imageData.club ?? null,
        department: imageData.department ?? null,
        unit: imageData.unit ?? null,
        section: imageData.section ?? null,
        isActive: imageData.isActive,
        caption: imageData.caption ?? '',
        displayOrder: imageData.displayOrder,
        image: undefined
      });
    } else {
      reset(galleryUpdateDefaultValues);
    }
  }, [imageData, reset]);

  const onSubmit = async (data: TGlobalGalleryUpdateFormDataType) => {
    if (!imageData) return;
    try {
      const payload: IGlobalGalleryImageUpdatePayload = {
        globalEvent: data.globalEvent,
        union: data.union,
        club: data.club,
        department: data.department,
        unit: data.unit,
        section: data.section,
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
