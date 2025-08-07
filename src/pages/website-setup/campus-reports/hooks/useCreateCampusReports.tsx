import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICampusReportsCreatePayload } from '../redux/types';

import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';
import { useCreateCampusReportsMutation } from '../redux/campusReports.api';

import { handleClientError } from '@/utils/functions/handleError';
import { ICampusReportsCreateFormProps } from '../components/create-form';
import {
  campusReportsCreateFields,
  campusReportsCreateFormSchema,
  defaultValues,
  TCampusReportsCreateFormDataType
} from '../components/create-form/config';
import { useFiscalSessions } from './useFiscalSessions';

const useCreateCampusReports = ({ onClose }: ICampusReportsCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [createCampusReports] = useCreateCampusReportsMutation();
  const [formFields, setFormFields] = useState(campusReportsCreateFields);
  const { fiscalSessionsOptions } = useFiscalSessions();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<TCampusReportsCreateFormDataType>({
    resolver: zodResolver(campusReportsCreateFormSchema),
    defaultValues
  });

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

  // NOTE - Form submit handler
  const onSubmit = async (data: TCampusReportsCreateFormDataType) => {
    try {
      const payload = { ...data } as ICampusReportsCreatePayload;
      const res = await createCampusReports(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TCampusReportsCreateFormDataType>({
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

export default useCreateCampusReports;
