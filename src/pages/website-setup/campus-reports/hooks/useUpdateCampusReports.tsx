// PACKAGE IMPORTS
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

// PROJECT IMPORTS
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { handleClientError } from '@/utils/functions/handleError';

// LOCAL IMPORTS
import {
  campusReportsUpdateFields,
  campusReportsUpdateFormSchema,
  defaultValues,
  TCampusReportsUpdateFormDataType
} from '../components/update-form/config';
import { ICampusReportsUpdateFormProps } from '../components/update-form/Form';
import { usePatchCampusReportsMutation } from '../redux/campusReports.api';
import { ICampusReportsUpdatePayload } from '../redux/types';
import { useFiscalSessions } from './useFiscalSessions';

const useUpdateCampusReports = ({ campusReportsData, onClose }: ICampusReportsUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateCampusReports] = usePatchCampusReportsMutation();
  const [formFields, setFormFields] = useState(campusReportsUpdateFields);
  const { fiscalSessionsOptions } = useFiscalSessions();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TCampusReportsUpdateFormDataType>({
    resolver: zodResolver(campusReportsUpdateFormSchema),
    defaultValues
  });

  // Reset form with data when it's available
  useEffect(() => {
    if (campusReportsData) {
      reset({
        ...campusReportsData,
        fiscalSession: campusReportsData.fiscalSession?.id ?? null
      });
    }
  }, [campusReportsData, reset]);

  // reset the options for fiscal session field
  useMemo(() => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.name === 'fiscalSession') {
          return { ...field, options: fiscalSessionsOptions || [] };
        }
        return field;
      })
    );
  }, [fiscalSessionsOptions]);

  // This is for form update not for inline update
  const onSubmit = async (data: TCampusReportsUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      const payload = {
        id,
        values: values as ICampusReportsUpdatePayload
      };
      const res = await updateCampusReports(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusReportsUpdateFormDataType>({
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

export default useUpdateCampusReports;
