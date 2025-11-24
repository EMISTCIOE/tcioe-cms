import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IStudentClubsCreatePayload } from '../redux/types';

import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateStudentClubsMutation } from '../redux/studentClubs.api';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';
import { authState } from '@/pages/authentication/redux/selector';

import { handleClientError } from '@/utils/functions/handleError';
import { IStudentClubsCreateFormProps } from '../components/create-form';
import {
  studentClubsCreateFields,
  studentClubsCreateFormSchema,
  defaultValues,
  TStudentClubsCreateFormDataType
} from '../components/create-form/config';

const useCreateStudentClubs = ({ onClose }: IStudentClubsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { roleType, departmentId } = useAppSelector(authState);
  const { enqueueSnackbar } = useSnackbar();
  const [createStudentClubs] = useCreateStudentClubsMutation();
  const [formFields, setFormFields] = useState(studentClubsCreateFields);
  const { options: departmentOptions } = useDepartmentOptions();

  useEffect(() => {
    setFormFields((prev) =>
      prev.map((field) =>
        field.name === 'department'
          ? {
              ...field,
              options: departmentOptions,
              disabled: roleType === 'DEPARTMENT-ADMIN'
            }
          : field
      )
    );
  }, [departmentOptions, roleType]);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TStudentClubsCreateFormDataType>({
    resolver: zodResolver(studentClubsCreateFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (roleType === 'DEPARTMENT-ADMIN' && departmentId) {
      setValue('department', String(departmentId));
    }
  }, [roleType, departmentId, setValue]);

  // NOTE - Form submit handler
  const onSubmit = async (data: TStudentClubsCreateFormDataType) => {
    try {
      const payload = { ...data } as IStudentClubsCreatePayload;
      const res = await createStudentClubs(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TStudentClubsCreateFormDataType>({
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

export default useCreateStudentClubs;
