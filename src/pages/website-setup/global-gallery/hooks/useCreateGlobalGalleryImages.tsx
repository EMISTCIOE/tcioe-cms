import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';
import { useCampusUnionOptions } from '@/hooks/useCampusUnionOptions';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';
import { useStudentClubs } from '@/pages/student-clubs-setup/student-clubs/hooks/useStudentClubs';
import { useGlobalEventOptions } from '@/hooks/useGlobalEventOptions';

import { useCreateGlobalGalleryImagesMutation } from '../redux/globalGalleryImages.api';
import {
  TGlobalGalleryCreateFormDataType,
  defaultValues,
  globalGalleryCreateFields,
  TGalleryImage,
  globalGalleryCreateFormSchema
} from '../components/create-form/config';
import { IGlobalGalleryImageCreatePayload } from '../redux/globalGalleryImages.types';

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

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TGlobalGalleryCreateFormDataType>({
    resolver: zodResolver(globalGalleryCreateFormSchema),
    defaultValues
  });

  useEffect(() => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'union') {
          return { ...field, options: unionOptions };
        }
        if (field.name === 'club') {
          return { ...field, options: studentClubsOptions };
        }
        if (field.name === 'department') {
          return { ...field, options: departmentOptions };
        }
        if (field.name === 'globalEvent') {
          return { ...field, options: globalEventOptions };
        }
        return field;
      })
    );
  }, [globalEventOptions, unionOptions, studentClubsOptions, departmentOptions]);

  const onSubmit = async (data: TGlobalGalleryCreateFormDataType) => {
    try {
      const payload: IGlobalGalleryImageCreatePayload = {
        sourceTitle: data.sourceTitle?.trim(),
        sourceContext: data.sourceContext?.trim(),
        globalEvent: data.globalEvent,
        union: data.union,
        club: data.club,
        department: data.department,
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
