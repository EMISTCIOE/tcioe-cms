import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormSection from '@/components/app-form/FormSection';
import MainCard from '@/components/cards/MainCard';

import { useGetCampusStaffDesignationsQuery } from '@/pages/website-setup/campus-key-officials/redux/campusKeyOfficials.api';
import { useGetDepartmentsQuery } from '@/pages/website-setup/departments/redux/departments.api';
import { useGetStudentClubsQuery } from '@/pages/student-clubs-setup/student-clubs/redux/studentClubs.api';
import { useGetCampusUnionsQuery } from '@/pages/website-setup/campus-unions/redux/campusUnions.api';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { splitName } from '@/utils/functions/splitCombineName';
import { useCreateUserMutation, useGetUserRolesQuery, useLazyGetUsersQuery } from '../../redux/user.api';

import { SelectOption } from '@/components/app-form/types';
import useUniqueFieldValidation from '@/hooks/useUniqueFieldValidation';
import { handleClientError } from '@/utils/functions/handleError';
import { UserCreatePayload, UserRole } from '../../redux/types';
import { defaultValues, uniqueFieldNames, userInfoFields, UserInfoFormDataType, userInfoFormSchema } from './config';

type FixedRoleType = 'EMIS-STAFF' | 'ADMIN' | 'DEPARTMENT-ADMIN' | 'CLUB' | 'UNION';

interface UserCreateFormProps {
  onClose?: () => void;
  fixedRole?: FixedRoleType;
}

export default function UserCreateForm({ onClose, fixedRole }: UserCreateFormProps) {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createUser] = useCreateUserMutation();
  const { data: designationData } = useGetCampusStaffDesignationsQuery();
  const { data: departmentData } = useGetDepartmentsQuery({ search: '', paginationModel: { page: 0, pageSize: 500 }, sortModel: [] });
  const { data: studentClubsData } = useGetStudentClubsQuery({ search: '', paginationModel: { page: 0, pageSize: 500 }, sortModel: [] });
  const { data: campusUnionsData } = useGetCampusUnionsQuery({ search: '', paginationModel: { page: 0, pageSize: 500 }, sortModel: [] });
  const [triggerGetUsers] = useLazyGetUsersQuery();
  const { data: rolesData } = useGetUserRolesQuery({
    search: '',
    paginationModel: { page: 0, pageSize: 100 },
    sortModel: []
  });
  const [formFields, setFormFields] = useState(userInfoFields);

  const {
    control,
    watch,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<UserInfoFormDataType>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      ...defaultValues,
      role: fixedRole ?? defaultValues.role
    }
  });

  // NOTE - For Unique field validation
  const uniqueFieldValues = {
    email: watch('email'),
    phoneNo: watch('phoneNo')
  };

  const fetchUser = useCallback((args: any) => triggerGetUsers(args).unwrap(), [triggerGetUsers]);

  useUniqueFieldValidation({
    fields: [...uniqueFieldNames],
    values: uniqueFieldValues,
    triggerFunc: fetchUser,
    setError: (field, message) => {
      if (message) setError(field, { type: 'manual', message });
      else clearErrors(field);
    },
    debounceDelay: 300
  });
  // NOTE - Form submit handler
  const onSubmit = async (data: UserInfoFormDataType) => {
    try {
      const { name, ...rest } = data;
      const { firstName, middleName, lastName } = splitName(name);

      // Build payload; cast numeric select values to strings where backend expects IDs
      const payload: UserCreatePayload = {
        firstName,
        middleName,
        lastName,
        ...rest,
        role: ((rest as any).role as unknown as string) || fixedRole,
        designation: (rest as any).designation as unknown as string,
        department: (rest as any).department as unknown as string,
        club: (rest as any).club as unknown as string,
        union: (rest as any).union as unknown as string
      };

      const res = await createUser(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<UserInfoFormDataType>({
        error,
        setError,
        enqueueSnackbar,
        fieldKeyMap: {
          firstName: 'name',
          lastName: 'name',
          email: 'email',
          photo: 'photo',
          phoneNo: 'phoneNo',
          roles: 'roles',
          isActive: 'isActive'
        }
      });
    }
  };

  // NOTE - Fetching roles data and setting it to form fields
  useEffect(() => {
    if (rolesData?.count) {
      const roleOptions: SelectOption[] = rolesData.results.map((role: UserRole) => ({
        label: role.name,
        value: role.id
      }));

      setFormFields((prev) => prev.map((field) => (field.name === 'roles' ? { ...field, options: roleOptions } : field)));
    }
  }, [rolesData]);

  // Lock the account type selector when a fixed role is provided
  useEffect(() => {
    const baseRoleField = userInfoFields.find((field) => field.name === 'role');

    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name !== 'role') {
          return field;
        }

        const filteredOptions = fixedRole
          ? (baseRoleField?.options || []).filter((option) => option.value === fixedRole)
          : baseRoleField?.options || field.options;

        return {
          ...field,
          options: filteredOptions,
          disabled: Boolean(fixedRole)
        };
      })
    );
  }, [fixedRole]);

  useEffect(() => {
    setValue('role', (fixedRole ?? defaultValues.role) as any, { shouldValidate: true, shouldDirty: false });
  }, [fixedRole, setValue]);

  // Populate designation/department/club/union options when data available
  useEffect(() => {
    if (designationData?.results) {
      const options: SelectOption[] = designationData.results.map((d: any) => ({ label: d.title, value: d.id }));
      setFormFields((prev) => prev.map((field) => (field.name === 'designation' ? { ...field, options } : field)));
    }
  }, [designationData]);

  useEffect(() => {
    if (departmentData?.results) {
      const options: SelectOption[] = departmentData.results.map((d: any) => ({ label: d.name, value: d.id }));
      setFormFields((prev) => prev.map((field) => (field.name === 'department' ? { ...field, options } : field)));
    }
  }, [departmentData]);

  useEffect(() => {
    if (studentClubsData?.results) {
      const options: SelectOption[] = studentClubsData.results.map((d: any) => ({ label: d.name, value: d.id }));
      setFormFields((prev) => prev.map((field) => (field.name === 'club' ? { ...field, options } : field)));
    }
  }, [studentClubsData]);

  useEffect(() => {
    if (campusUnionsData?.results) {
      const options: SelectOption[] = campusUnionsData.results.map((d: any) => ({ label: d.name, value: d.id }));
      setFormFields((prev) => prev.map((field) => (field.name === 'union' ? { ...field, options } : field)));
    }
  }, [campusUnionsData]);

  // extraComponents left empty; no password fields on frontend
  const extraComponents = {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard divider title="Create New User">
            <FormSection<UserInfoFormDataType>
              fields={formFields}
              control={control}
              errors={errors}
              formValues={watch()}
              childrenForInput={extraComponents}
            />
          </MainCard>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={Object.keys(errors).length > 0}>
            Create
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
