import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { enumToOptions } from '@/utils/functions/formatString';
import { ICampusEvent } from '@/pages/website-setup/campus-events/redux/types';

export const globalEventsCreateFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  eventType: z.nativeEnum(ICampusEvent).optional(),
  eventStartDate: z.string().optional(),
  eventEndDate: z.string().optional(),
  thumbnail: z.any().optional(),
  unions: z.array(z.number()).optional(),
  clubs: z.array(z.number()).optional(),
  departments: z.array(z.number()).optional(),
  isActive: z.boolean().default(true)
});

export type TGlobalEventsCreateFormDataType = z.infer<typeof globalEventsCreateFormSchema>;

export const globalEventsCreateFields: FormField<TGlobalEventsCreateFormDataType>[] = [
  { name: 'title', label: 'Title', type: 'text', xs: 12, sm: 6, required: true },
  { name: 'description', label: 'Description', type: 'editor', xs: 12, sm: 12 },
  { name: 'eventType', label: 'Event Type', type: 'select', xs: 12, sm: 6, options: enumToOptions(ICampusEvent) },
  { name: 'eventStartDate', label: 'Start Date', type: 'date', xs: 12, sm: 3 },
  { name: 'eventEndDate', label: 'End Date', type: 'date', xs: 12, sm: 3 },
  { name: 'thumbnail', label: 'Thumbnail', type: 'image', xs: 12, sm: 4 },
  { name: 'unions', label: 'Unions', type: 'select', xs: 12, sm: 4, multipleChips: true, options: [] },
  { name: 'clubs', label: 'Clubs', type: 'select', xs: 12, sm: 4, multipleChips: true, options: [] },
  { name: 'departments', label: 'Departments', type: 'select', xs: 12, sm: 4, multipleChips: true, options: [] },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 2 }
];

export const globalEventsCreateDefaultValues: TGlobalEventsCreateFormDataType = {
  title: '',
  description: '',
  eventType: undefined,
  eventStartDate: undefined,
  eventEndDate: undefined,
  thumbnail: null,
  unions: [],
  clubs: [],
  departments: [],
  isActive: true
};
