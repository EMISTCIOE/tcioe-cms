import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';
import { useCampusUnionOptions } from '@/hooks/useCampusUnionOptions';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';
import { useStudentClubs } from '@/pages/student-clubs-setup/student-clubs/hooks/useStudentClubs';
import { useCreateGlobalEventsMutation } from '../redux/globalEvents.api';
import {
  TGlobalEventsCreateFormDataType,
  globalEventsCreateFields,
  globalEventsCreateDefaultValues,
  globalEventsCreateFormSchema
} from '../components/create-form/config';
import { IGlobalEventsCreatePayload } from '../redux/globalEvents.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { authState } from '@/pages/authentication/redux/selector';

const normalizeFile = (input: File | FileList | null | undefined) => {
  if (input instanceof FileList) {
    return input[0];
  }
  return input ?? null;
};

const useCreateGlobalEvents = ({ onClose }: { onClose?: () => void }) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createEvent] = useCreateGlobalEventsMutation();
  const [formFields, setFormFields] = useState(globalEventsCreateFields);
  const { options: unionOptions } = useCampusUnionOptions();
  const { options: departmentOptions } = useDepartmentOptions();
  const { studentClubsOptions } = useStudentClubs();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TGlobalEventsCreateFormDataType>({
    resolver: zodResolver(globalEventsCreateFormSchema),
    defaultValues: globalEventsCreateDefaultValues
  });

  const { roleType, unionId } = useAppSelector(authState);

  useEffect(() => {
    const isUnion = roleType === 'UNION' && Boolean(unionId);
    const lockedUnionOption = unionOptions.find((option) => String(option.value) === String(unionId));

    setFormFields((prev) => {
      const updatedFields = prev.map((field) => {
        if (field.name === 'unions') {
          return {
            ...field,
            options: isUnion && lockedUnionOption ? [lockedUnionOption] : unionOptions,
            disabled: Boolean(isUnion)
          };
        }
        if (field.name === 'departments') {
          return {
            ...field,
            options: departmentOptions
          };
        }
        if (field.name === 'clubs') {
          return {
            ...field,
            options: studentClubsOptions
          };
        }
        return field;
      });

      // Filter out fields based on user role
      if (isUnion) {
        // Union users: only show unions field (hide departments and clubs)
        return updatedFields.filter((field) => field.name !== 'departments' && field.name !== 'clubs');
      }

      // For admin/EMIS staff: show all fields
      return updatedFields;
    });
  }, [unionOptions, departmentOptions, studentClubsOptions, roleType, unionId]);

  useEffect(() => {
    if (roleType === 'UNION' && unionId) {
      setValue('unions', [Number(unionId)]);
    }
  }, [roleType, unionId, setValue]);

  const onSubmit = async (data: TGlobalEventsCreateFormDataType) => {
    try {
      const payload: IGlobalEventsCreatePayload = {
        title: data.title.trim(),
        description: data.description?.trim(),
        eventType: data.eventType,
        eventStartDate: data.eventStartDate,
        eventEndDate: data.eventEndDate,
        thumbnail: normalizeFile(data.thumbnail),
        isActive: data.isActive,
        unions: data.unions?.map(String),
        clubs: data.clubs?.map(String),
        departments: data.departments?.map(String)
      };

      const response = await createEvent(payload).unwrap();
      dispatch(setMessage({ message: response.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TGlobalEventsCreateFormDataType>({ error, setError, enqueueSnackbar });
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

export default useCreateGlobalEvents;
