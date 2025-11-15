import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';
import { useCampusEventOptions } from '@/hooks/useCampusEventOptions';
import { useStudentClubEventOptions } from '@/hooks/useStudentClubEventOptions';
import { useDepartmentEventOptions } from '@/hooks/useDepartmentEventOptions';
import { useCampusUnionOptions } from '@/hooks/useCampusUnionOptions';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';
import { useStudentClubs } from '@/pages/student-clubs-setup/student-clubs/hooks/useStudentClubs';
import { usePatchGlobalGalleryCollectionMutation } from '../redux/globalGalleryCollections.api';
import {
  globalGalleryUpdateFields,
  globalGalleryUpdateFormSchema,
  galleryUpdateDefaultValues,
  TGlobalGalleryUpdateFormDataType,
  TUpdateGalleryImage
} from '../components/update-form/config';
import { IGlobalGalleryCollection, IGlobalGalleryCollectionUpdatePayload } from '../redux/globalGalleryCollections.types';

const normalizeFile = (input: File | FileList | null | undefined) => {
  if (input instanceof FileList) {
    return input[0];
  }
  return input ?? null;
};

const mapImagesPayload = (images: TUpdateGalleryImage[]) =>
  images.map((image) => {
    const file = normalizeFile(image.image);
    const payload: IGlobalGalleryCollectionUpdatePayload['images'][number] = {
      id: image.id,
      caption: image.caption?.trim() || undefined,
      displayOrder: image.displayOrder
    };

    if (file) {
      payload.image = file;
    } else if (typeof image.image === 'string') {
      payload.image = image.image;
    }
    return payload;
  });

const useUpdateGlobalGalleryCollection = ({
  collectionData,
  onClose
}: {
  collectionData?: IGlobalGalleryCollection;
  onClose?: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCollection] = usePatchGlobalGalleryCollectionMutation();
  const [formFields, setFormFields] = useState(globalGalleryUpdateFields);
  const { options: campusEventOptions } = useCampusEventOptions();
  const { options: studentClubEventOptions } = useStudentClubEventOptions();
  const { options: departmentEventOptions } = useDepartmentEventOptions();
  const { options: unionOptions } = useCampusUnionOptions();
  const { options: departmentOptions } = useDepartmentOptions();
  const { studentClubsOptions } = useStudentClubs();

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
        if (field.name === 'campusEvent') {
          return { ...field, options: campusEventOptions };
        }
        if (field.name === 'studentClubEvent') {
          return { ...field, options: studentClubEventOptions };
        }
        if (field.name === 'departmentEvent') {
          return { ...field, options: departmentEventOptions };
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
        return field;
      })
    );
  }, [campusEventOptions, studentClubEventOptions, departmentEventOptions, unionOptions, studentClubsOptions, departmentOptions]);

  useEffect(() => {
    if (collectionData) {
      reset({
        id: collectionData.id,
        title: collectionData.title ?? '',
        description: collectionData.description ?? '',
        campusEvent: collectionData.campusEvent?.id ?? null,
        studentClubEvent: collectionData.studentClubEvent?.id ?? null,
        departmentEvent: collectionData.departmentEvent?.id ?? null,
        union: collectionData.union?.id ?? null,
        club: collectionData.club?.id ?? null,
        department: collectionData.department?.id ?? null,
        isActive: collectionData.isActive,
        images:
          collectionData.images?.map((image) => ({
            id: image.id,
            image: image.image,
            caption: image.caption ?? '',
            displayOrder: image.displayOrder
          })) ?? []
      });
    } else {
      reset(galleryUpdateDefaultValues);
    }
  }, [collectionData, reset]);

  const onSubmit = async (data: TGlobalGalleryUpdateFormDataType) => {
    if (!collectionData) return;
    try {
      const payload: IGlobalGalleryCollectionUpdatePayload = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        campusEvent: data.campusEvent,
        studentClubEvent: data.studentClubEvent,
        departmentEvent: data.departmentEvent,
        union: data.union,
        club: data.club,
        department: data.department,
        isActive: data.isActive,
        images: mapImagesPayload(data.images)
      };

      const res = await updateCollection({ id: collectionData.id, values: payload }).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TGlobalGalleryUpdateFormDataType>({ error, setError, enqueueSnackbar });
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

export default useUpdateGlobalGalleryCollection;
