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
import { useCampusSectionOptions } from '@/hooks/useCampusSectionOptions';
import { useCampusUnitOptions } from '@/hooks/useCampusUnitOptions';

const useUpdateCampusKeyOfficials = ({ campusKeyOfficialsData, onClose }: ICampusKeyOfficialsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusKeyOfficials] = usePatchCampusKeyOfficialsMutation();
  const { data: designationData } = useGetCampusStaffDesignationsQuery();
  const { data: departmentData } = useGetDepartmentsQuery({ search: '', paginationModel: { page: 0, pageSize: 500 }, sortModel: [] });
  const { options: campusSectionOptions } = useCampusSectionOptions();
  const { options: unitOptions } = useCampusUnitOptions();
  const [formFields, setFormFields] = useState(campusKeyOfficialsUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    setValue,
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
      // Reset core fields immediately, but avoid setting department/unit/campusSection
      // until their options are loaded to prevent MUI "out-of-range" warnings.
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
        displayOrder: dataAny.display_order ?? dataAny.displayOrder ?? 1
      });
    }
  }, [campusKeyOfficialsData, reset]);

  // After options are loaded, set department/unit/campusSection values if present
  useEffect(() => {
    if (!campusKeyOfficialsData) return;
    const dataAny: any = campusKeyOfficialsData as any;

    // Backend may return department OR unit in `department` field (legacy).
    // Only treat `department` as a department when its `type` is explicitly 'department'.
    // If `department` has type 'unit', treat it as unit.
    let departmentId: any = undefined;
    let unitId: any = undefined;

    const deptField = dataAny.department;
    if (deptField) {
      if (typeof deptField === 'object') {
        if (deptField.type === 'department') {
          departmentId = deptField.id;
        } else if (deptField.type === 'unit') {
          unitId = deptField.id;
        }
      } else {
        // primitive id
        departmentId = deptField;
      }
    }

    // explicit unit field should take precedence
    if (dataAny.unit) {
      const u = dataAny.unit;
      unitId = typeof u === 'object' ? u.id : u;
    }
    const campusSectionId =
      dataAny.campus_section?.id ?? dataAny.campus_section ?? dataAny.campusSection?.id ?? dataAny.campusSection ?? undefined;

    // Only set values if options for corresponding selects exist to avoid out-of-range warnings.
    if (departmentId !== undefined) {
      const hasDeptOption = formFields.find((f) => f.name === 'department' && (f.options?.length ?? 0) > 0);
      if (hasDeptOption) {
        // set the department only when its options exist
        setValue('department', departmentId);
      }
    }

    if (unitId !== undefined) {
      const hasUnitOption = formFields.find((f) => f.name === 'unit' && (f.options?.length ?? 0) > 0);
      if (hasUnitOption) {
        setValue('unit', unitId);
      }
    }

    if (campusSectionId !== undefined) {
      const hasSectionOption = formFields.find((f) => f.name === 'campusSection' && (f.options?.length ?? 0) > 0);
      if (hasSectionOption) {
        setValue('campusSection', campusSectionId);
      }
    }
  }, [campusKeyOfficialsData, formFields, control]);

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
    // Ensure an empty placeholder option exists so selects don't auto-pick the first option
    const departmentOptionsWithEmpty = [{ value: '', label: '' }, ...departmentOptions];

    const mappedUnitOptions = unitOptions.map((o) => ({ label: o.label, value: Number(o.value) }));
    const unitOptionsWithEmpty = [{ value: '', label: '' }, ...mappedUnitOptions];

    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'department') return { ...field, options: departmentOptionsWithEmpty };
        if (field.name === 'unit') return { ...field, options: unitOptionsWithEmpty };
        if (field.name === 'campusSection') return { ...field, options: campusSectionOptions };
        return field;
      })
    );
  }, [departmentData, campusSectionOptions, unitOptions]);

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
      if (apiValues.campusSection === '') {
        apiValues.campusSection = null;
      }
      if (apiValues.unit === '') {
        apiValues.unit = null;
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
          department: 'department',
          campusSection: 'campusSection',
          unit: 'unit'
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
