import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { globalEventsCreateFormSchema, globalEventsCreateFields, TGlobalEventsCreateFormDataType } from '../create-form/config';

export const globalEventsUpdateFormSchema = globalEventsCreateFormSchema.partial();

export type TGlobalEventsUpdateFormDataType = z.infer<typeof globalEventsUpdateFormSchema>;

export const globalEventsUpdateFields: FormField<TGlobalEventsUpdateFormDataType>[] = globalEventsCreateFields;
