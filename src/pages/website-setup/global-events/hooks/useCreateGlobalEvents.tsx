import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/libs/hooks';
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
    formState: { errors }
  } = useForm<TGlobalEventsCreateFormDataType>({
    resolver: zodResolver(globalEventsCreateFormSchema),
    defaultValues: globalEventsCreateDefaultValues
  });

  useEffect(() => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'unions') {
          return { ...field, options: unionOptions };
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
  }, [unionOptions, departmentOptions, studentClubsOptions]);

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
        unions: data.unions,
        clubs: data.clubs,
        departments: data.departments
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
