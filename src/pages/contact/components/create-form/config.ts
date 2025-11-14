import { z } from 'zod';
import { FormField } from '@/components/app-form/types';
import { IPhoneNumberCreatePayload } from '../../redux/types';

// Zod schema for validation
export const phoneNumberCreateFormSchema = z.object({
  department_name: z.string().min(1, 'Department name is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  description: z.string().optional(),
  display_order: z.number().min(0, 'Display order must be positive')
});

export type TPhoneNumberCreateFormDataType = z.infer<typeof phoneNumberCreateFormSchema>;

// Default values for the form
export const defaultValues: TPhoneNumberCreateFormDataType = {
  department_name: '',
  phone_number: '',
  description: '',
  display_order: 0
};

// Form field configurations
export const phoneNumberCreateFields: FormField<TPhoneNumberCreateFormDataType>[] = [
  {
    name: 'department_name',
    label: 'Department/Section Name',
    type: 'text',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    type: 'text',
    required: true,
    xs: 12,
    sm: 6
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    multiline: true,
    rows: 3,
    xs: 12
  },
  {
    name: 'display_order',
    label: 'Display Order',
    type: 'number',
    required: true,
    xs: 12,
    sm: 6
  }
];
