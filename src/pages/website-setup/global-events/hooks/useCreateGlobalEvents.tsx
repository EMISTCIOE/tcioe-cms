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
import { useCanAccessApprovalFields } from '@/utils/permissions/helpers';

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
  const canAccessApprovalFields = useCanAccessApprovalFields();

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

  const { roleType, unionId, departmentId, clubId } = useAppSelector(authState);

  useEffect(() => {
    const isUnion = roleType === 'UNION' && Boolean(unionId);
    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isStudentClub = roleType === 'CLUB' && Boolean(clubId);
    const lockedUnionOption = unionOptions.find((option) => String(option.value) === String(unionId));
    const lockedDepartment = departmentOptions.find((option) => String(option.value) === String(departmentId));
    const lockedClub = studentClubsOptions.find((option) => String(option.value) === String(clubId));

    setFormFields(() => {
      let updatedFields = globalEventsCreateFields.map((field) => {
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
            options: isDepartmentAdmin && lockedDepartment ? [lockedDepartment] : departmentOptions,
            disabled: Boolean(isDepartmentAdmin && lockedDepartment)
          };
        }
        if (field.name === 'clubs') {
          return {
            ...field,
            options: isStudentClub && lockedClub ? [lockedClub] : studentClubsOptions,
            disabled: Boolean(isStudentClub && lockedClub)
          };
        }
        return field;
      });

      if (!canAccessApprovalFields) {
        updatedFields = updatedFields.filter((field) => field.name !== 'isApprovedByDepartment' && field.name !== 'isApprovedByCampus');
      }

      if (isUnion) {
        return updatedFields.filter((field) => field.name !== 'departments' && field.name !== 'clubs');
      }
      if (isDepartmentAdmin) {
        return updatedFields.filter((field) => field.name !== 'clubs' && field.name !== 'unions');
      }
      if (isStudentClub) {
        return updatedFields.filter((field) => field.name !== 'unions' && field.name !== 'departments');
      }

      return updatedFields;
    });
  }, [unionOptions, departmentOptions, studentClubsOptions, roleType, unionId, departmentId, clubId, canAccessApprovalFields]);

  useEffect(() => {
    if (roleType === 'UNION' && unionId) {
      setValue('unions', [Number(unionId)]);
    }
  }, [roleType, unionId, setValue]);

  useEffect(() => {
    const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
    const isStudentClub = roleType === 'CLUB' && Boolean(clubId);

    if (isDepartmentAdmin && departmentId && departmentOptions.length > 0) {
      setValue('departments', [Number(departmentId)]);
    }
    if (isStudentClub && clubId && studentClubsOptions.length > 0) {
      setValue('clubs', [Number(clubId)]);
    }
  }, [roleType, departmentId, clubId, departmentOptions, studentClubsOptions, setValue]);

  const onSubmit = async (data: TGlobalEventsCreateFormDataType) => {
    try {
      const isDepartmentAdmin = roleType === 'DEPARTMENT-ADMIN' && Boolean(departmentId);
      const isStudentClub = roleType === 'CLUB' && Boolean(clubId);

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

      if (canAccessApprovalFields) {
        payload.isApprovedByDepartment = Boolean(data.isApprovedByDepartment);
        payload.isApprovedByCampus = Boolean(data.isApprovedByCampus);
      }

      if (isDepartmentAdmin && departmentId) {
        payload.departments = [String(departmentId)];
        payload.clubs = undefined;
        payload.unions = undefined;
      }

      if (isStudentClub && clubId) {
        payload.clubs = [String(clubId)];
        payload.unions = undefined;
        payload.departments = undefined;
      }

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
