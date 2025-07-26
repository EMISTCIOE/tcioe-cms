import * as z from 'zod';
import { FormField } from '@/components/app-form/types';
import { NoticeStatus } from '../../redux/types';
import { enumToOptions } from '@/utils/functions/formatString';

// NOTE - Define the schema for the form.
export const noticeStatusUpdateFormSchema = z.object({
  id: z.number().min(1, 'Notice ID is required'),
  status: z.nativeEnum(NoticeStatus).default(NoticeStatus.PENDING)
});

// NOTE - Generate a type from the schema
export type TNoticeStatusUpdateFormDataType = z.infer<typeof noticeStatusUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TNoticeStatusUpdateFormDataType> = {
  status: NoticeStatus.PENDING
};

// NOTE - Define the form fields
export const noticeStatusUpdateFields: FormField<TNoticeStatusUpdateFormDataType>[] = [
  { name: 'status', label: 'Status', xs: 12, sm: 12, type: 'select', options: [...enumToOptions(NoticeStatus)], required: true }
];
