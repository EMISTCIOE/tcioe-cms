// PACKAGE IMPORTS
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// PROJECT IMPORTS
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';

// LOCAL IMPORTS
import {
  studentClubsUpdateFields,
  studentClubsUpdateFormSchema,
  defaultValues,
  Member,
  TStudentClubsUpdateFormDataType
} from '../components/update-form/config';
import { IStudentClubsUpdateFormProps } from '../components/update-form/Form';
import { useDeletStudentClubsMemberMutation, usePatchStudentClubsMutation } from '../redux/studentClubs.api';
import { IStudentClubsUpdatePayload } from '../redux/types';
import { TField } from '@/components/app-form/types';
import { useDepartmentOptions } from '@/hooks/useDepartmentOptions';
import { authState } from '@/pages/authentication/redux/selector';

const useUpdateStudentClubs = ({ studentClubsData, onClose }: IStudentClubsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateStudentClubs] = usePatchStudentClubsMutation();
  const [deleteStudentClubsMemberItem] = useDeletStudentClubsMemberMutation();
  const [formFields, setFormFields] = useState(studentClubsUpdateFields);
  const { options: departmentOptions } = useDepartmentOptions();
  const { roleType, departmentId } = useAppSelector(authState);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm<TStudentClubsUpdateFormDataType>({
    resolver: zodResolver(studentClubsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (studentClubsData) {
      reset({
        ...studentClubsData,
        department:
          roleType === 'CLUB'
            ? departmentId
              ? String(departmentId)
              : null
            : studentClubsData.department?.id
              ? String(studentClubsData.department.id)
              : null
      });
    }
  }, [studentClubsData, reset, roleType, departmentId]);

  // delete handler for member item
  const handleDeleteMemberItem = async (index: number, member_id?: string) => {
    if (!studentClubsData?.id || !member_id) return;

    try {
      const res = await deleteStudentClubsMemberItem({ id: studentClubsData.id, member_id }).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
    } catch (error) {
      dispatch(setMessage({ message: 'Failed to delete media', variant: 'error' }));
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    const updatedFields = formFields.map((f) =>
      f.name === 'members'
        ? {
            ...f,
            onDelete: (index: number, field: TField<Member>) => handleDeleteMemberItem(index, field?.id)
          }
        : f
    );
    setFormFields(updatedFields);
  }, [studentClubsData]);

  useEffect(() => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'department') {
          return {
            ...field,
            options: departmentOptions ?? [],
            disabled: roleType === 'CLUB'
          };
        }
        return field;
      })
    );
  }, [departmentOptions, roleType]);

  useEffect(() => {
    // For club users, ensure department value and option are set even if options array is empty
    if (roleType === 'CLUB') {
      const fallbackDepartmentId =
        departmentId || studentClubsData?.department?.id ? String(departmentId || studentClubsData?.department?.id) : null;

      if (fallbackDepartmentId) {
        setValue('department', fallbackDepartmentId);

        setFormFields((prev) =>
          prev.map((field) => {
            if (field.name === 'department') {
              const optionExists = (field.options || []).some((opt) => opt.value === fallbackDepartmentId);
              return {
                ...field,
                options: optionExists
                  ? field.options
                  : [
                      ...(field.options || []),
                      {
                        label: studentClubsData?.department?.name || 'My Department',
                        value: fallbackDepartmentId
                      }
                    ],
                disabled: true
              };
            }
            return field;
          })
        );
      }
    }
    // If department still empty but we have options, pick the first as fallback to pass validation
    if (!watch('department') && departmentOptions?.length) {
      const firstOption = departmentOptions[0];
      setValue('department', String(firstOption.value));
    }
  }, [roleType, departmentId, setValue, departmentOptions, studentClubsData]);

  // This is for form update not for inline update
  const onSubmit = async (data: TStudentClubsUpdateFormDataType) => {
    console.log('Submitting student club update payload:', data);
    const { id, ...values } = data;
    if (!values.members) {
      values.members = [];
    }
    if (values.department && typeof values.department !== 'string') {
      values.department = String(values.department);
    }
    try {
      const payload = {
        id,
        values: values as IStudentClubsUpdatePayload
      };
      const res = await updateStudentClubs(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TStudentClubsUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar
      });
    }
  };

  return {
    submitHandler: handleSubmit(onSubmit),
    control,
    errors,
    watch,
    formFields
  };
};

export default useUpdateStudentClubs;
