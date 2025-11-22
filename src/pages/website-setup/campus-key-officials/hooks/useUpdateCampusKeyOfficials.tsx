// PACKAGE IMPORTS
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// PROJECT IMPORTS
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';

// LOCAL IMPORTS
import {
  campusKeyOfficialsUpdateFields,
  campusKeyOfficialsUpdateFormSchema,
  defaultValues,
  TCampusKeyOfficialsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusKeyOfficialsUpdateFormProps } from '../components/update-form/Form';
import { useGetCampusStaffDesignationsQuery, usePatchCampusKeyOfficialsMutation } from '../redux/campusKeyOfficials.api';
import { ICampusKeyOfficialsUpdatePayload } from '../redux/types';
import { useGetDepartmentsQuery } from '@/pages/website-setup/departments/redux/departments.api';

const useUpdateCampusKeyOfficials = ({ campusKeyOfficialsData, onClose }: ICampusKeyOfficialsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusKeyOfficials] = usePatchCampusKeyOfficialsMutation();
  const { data: designationData } = useGetCampusStaffDesignationsQuery();
  const { data: departmentData } = useGetDepartmentsQuery({ search: '', paginationModel: { page: 0, pageSize: 500 }, sortModel: [] });
  const [formFields, setFormFields] = useState(campusKeyOfficialsUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusKeyOfficialsUpdateFormDataType>({
    resolver: zodResolver(campusKeyOfficialsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusKeyOfficialsData) {
      // Map values from API response into the form. Use `any` to allow both
      // snake_case (server) and camelCase (typed) shapes.
      const dataAny: any = campusKeyOfficialsData as any;
      reset({
        id: Number(dataAny.id),
        titlePrefix: dataAny.title_prefix ?? dataAny.titlePrefix,
        designation: dataAny.designation ?? dataAny.designation,
        fullName: dataAny.full_name ?? dataAny.fullName ?? '',
        message: dataAny.message ?? '',
        photo: dataAny.photo ?? null,
        email: dataAny.email ?? null,
        phoneNumber: dataAny.phone_number ?? dataAny.phoneNumber ?? '',
        isKeyOfficial: dataAny.is_key_official ?? dataAny.isKeyOfficial ?? true,
        isActive: dataAny.is_active ?? dataAny.isActive ?? true,
        displayOrder: dataAny.display_order ?? dataAny.displayOrder ?? 1,
        department: dataAny.department?.id ?? dataAny.department ?? undefined
      });
    }
  }, [campusKeyOfficialsData, reset]);

  useEffect(() => {
    const options =
      designationData?.results
        ?.filter((item) => item.isActive)
        .map((item) => ({
          value: item.code,
          label: item.title
        })) ?? [];

    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'designation') {
          return { ...field, options };
        }
        return field;
      })
    );
  }, [designationData]);

  useEffect(() => {
    const departmentOptions =
      departmentData?.results?.map((item) => ({
        value: item.id,
        label: item.name
      })) ?? [];

    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'department') return { ...field, options: departmentOptions };
        return field;
      })
    );
  }, [departmentData]);

  // This is for form update not for inline update
  const onSubmit = async (data: TCampusKeyOfficialsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      // Transform displayOrder (camelCase) to display_order for backend
      const apiValues: any = { ...values };
      if (apiValues.displayOrder !== undefined) {
        apiValues.display_order = apiValues.displayOrder;
        delete apiValues.displayOrder;
      }

      const payload = {
        id: String(id), // API expects id as string
        values: apiValues as ICampusKeyOfficialsUpdatePayload
      };
      const res = await updateCampusKeyOfficials(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusKeyOfficialsUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar,
        fieldKeyMap: {
          titlePrefix: 'titlePrefix',
          designation: 'designation',
          fullName: 'fullName',
          email: 'email',
          phoneNumber: 'phoneNumber',
          message: 'message',
          photo: 'photo',
          isKeyOfficial: 'isKeyOfficial',
          isActive: 'isActive',
          department: 'department'
        }
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

export default useUpdateCampusKeyOfficials;
