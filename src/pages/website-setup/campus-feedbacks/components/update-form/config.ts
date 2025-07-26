import * as z from 'zod';
import { FormField } from '@/components/app-form/types';
import { enumToOptions } from '@/utils/functions/formatString';

// NOTE - Define the schema for the form.
export const campusFeedbacksUpdateFormSchema = z.object({
  id: z.number().min(1, 'Campus key Official is required'),
  isResolved: z.boolean().optional()
});

// NOTE - Generate a type from the schema
export type TCampusFeedbacksUpdateFormDataType = z.infer<typeof campusFeedbacksUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusFeedbacksUpdateFormDataType> = {
  id: undefined,
  isResolved: false
};

// NOTE - Define the form fields
export const campusFeedbacksUpdateFields: FormField<TCampusFeedbacksUpdateFormDataType>[] = [
  {
    name: 'isResolved',
    type: 'select',
    label: 'Resolved Status',
    options: [
      { label: 'Resolved', value: true },
      { label: 'Unresolved', value: false }
    ]
  }
];
