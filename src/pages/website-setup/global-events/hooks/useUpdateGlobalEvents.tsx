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
import { authState } from '@/pages/authentication/redux/selector';
import { usePatchGlobalEventsMutation } from '../redux/globalEvents.api';
import { globalEventsUpdateFields, globalEventsUpdateFormSchema, TGlobalEventsUpdateFormDataType } from '../components/update-form/config';
import { IGlobalEventsDetails, IGlobalEventsUpdatePayload } from '../redux/globalEvents.types';

const normalizeFile = (input: File | FileList | string | null | undefined) => {
  if (input instanceof FileList) {
    return input[0];
  }
  if (input instanceof File) {
    return input;
  }
  return null;
};

const useUpdateGlobalEvents = ({ eventData, onClose }: { eventData?: IGlobalEventsDetails; onClose?: () => void }) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateEvent] = usePatchGlobalEventsMutation();
  const [formFields, setFormFields] = useState(globalEventsUpdateFields);
  const { options: unionOptions } = useCampusUnionOptions();
  const { options: departmentOptions } = useDepartmentOptions();
  const { studentClubsOptions } = useStudentClubs();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm<TGlobalEventsUpdateFormDataType>({
    resolver: zodResolver(globalEventsUpdateFormSchema),
    defaultValues: {}
  });

  const { roleType, unionId } = useAppSelector(authState);

  useEffect(() => {
    const isUnion = roleType === 'UNION' && Boolean(unionId);
    const lockedUnionOption = unionOptions.find((option) => String(option.value) === String(unionId));

    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'unions') {
          return {
            ...field,
            options: isUnion && lockedUnionOption ? [lockedUnionOption] : unionOptions,
            disabled: Boolean(isUnion)
          };
        }
        if (field.name === 'departments') {
          return { ...field, options: departmentOptions };
        }
        if (field.name === 'clubs') {
          return { ...field, options: studentClubsOptions };
        }
        return field;
      })
    );
  }, [unionOptions, departmentOptions, studentClubsOptions, roleType, unionId]);

  useEffect(() => {
    if (eventData) {
      reset({
        title: eventData.title,
        description: eventData.description ?? '',
        eventType: eventData.eventType ?? undefined,
        eventStartDate: eventData.eventStartDate,
        eventEndDate: eventData.eventEndDate ?? undefined,
        thumbnail: eventData.thumbnail,
        unions: eventData?.unions?.map((item) => Number(item.id)) ?? [],
        clubs: eventData?.clubs?.map((item) => Number(item.id)) ?? [],
        departments: eventData?.departments?.map((item) => Number(item.id)) ?? [],
        isActive: eventData.isActive
      });
    } else {
      reset({});
    }
  }, [eventData, reset]);

  useEffect(() => {
    if (roleType === 'UNION' && unionId) {
      setValue('unions', [Number(unionId)]);
    }
  }, [roleType, unionId, setValue]);

  const onSubmit = async (data: TGlobalEventsUpdateFormDataType) => {
    if (!eventData) return;
    try {
      const file = normalizeFile(data.thumbnail);
      const payload: IGlobalEventsUpdatePayload = {
        title: data.title?.trim() ?? eventData.title,
        description: data.description?.trim() ?? eventData.description ?? undefined,
        eventType: data.eventType,
        eventStartDate: data.eventStartDate ?? eventData.eventStartDate,
        eventEndDate: data.eventEndDate ?? eventData.eventEndDate ?? undefined,
        thumbnail: file ?? (typeof data.thumbnail === 'string' ? data.thumbnail : undefined),
        isActive: data.isActive,
        unions: data.unions?.map(String),
        clubs: data.clubs?.map(String),
        departments: data.departments?.map(String)
      };

      const response = await updateEvent({ id: eventData.id, values: payload }).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TGlobalEventsUpdateFormDataType>({ error, setError, enqueueSnackbar });
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

export default useUpdateGlobalEvents;
