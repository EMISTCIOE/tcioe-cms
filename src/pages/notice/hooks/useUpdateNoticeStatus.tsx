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
  defaultValues,
  noticeStatusUpdateFields,
  noticeStatusUpdateFormSchema,
  TNoticeStatusUpdateFormDataType
} from '../components/status-update/config';
import { NoticeStatus } from '../redux/types';
import { INoticeStatusUpdateFormProps } from '../components/status-update/Form';
import { usePatchNoticeStatusMutation } from '../redux/notice.api';

const useUpdateNoticeStatus = ({ noticeData, onClose }: INoticeStatusUpdateFormProps) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [updateNoticeStatus] = usePatchNoticeStatusMutation();
  const [formFields, _] = useState(noticeStatusUpdateFields);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<TNoticeStatusUpdateFormDataType>({
    resolver: zodResolver(noticeStatusUpdateFormSchema),
    defaultValues
  });

  // Reset form values when noticeData changes
  useEffect(() => {
    if (noticeData) {
      reset({
        id: Number(noticeData.id),
        status: noticeData.status
      });
    }
  }, [noticeData, reset]);

  // This is for form update not for inline update
  const onSubmit = async (data: TNoticeStatusUpdateFormDataType) => {
    const { id, ...values } = data;
    try {
      // Ensure backend always receives APPROVED status from the CMS.
      const payload = {
        id,
        values: { ...values, status: NoticeStatus.APPROVED }
      };
      const res = await updateNoticeStatus(payload).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
      onClose?.();
    } catch (error) {
      handleClientError<TNoticeStatusUpdateFormDataType>({
        error,
        setError,
        enqueueSnackbar,
        fieldKeyMap: {
          status: 'status'
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

export default useUpdateNoticeStatus;
