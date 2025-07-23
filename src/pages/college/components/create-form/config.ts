import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

// NOTE - Define the schema for the form.
export const campusInfoCreateFormSchema = z.object({
  name: z.string().min(1, 'Title is required'),
  email: z.string().email('Invalid email adress').optional(),
  phone: z.number().min(10, 'Phone number is required').optional(),
  location: z.string().optional(),
  organizationChart: z
    .any()
    .refine(
      (file) => {
        if (!file) return true;
        const f = file instanceof FileList ? file[0] : file;
        return f instanceof File && f.type.startsWith('image/');
      },
      {
        message: 'Only image files are allowed'
      }
    )
    .optional(),
});

// NOTE - Generate a type from the schema
export type TCampusInfoCreateFormDataType = z.infer<typeof campusInfoCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusInfoCreateFormDataType> = {
  name: '',
  email: '',
  phone:undefined,
  location:'',
  organizationChart:null,
};

// NOTE - Define the form fields
export const campusInfoCreateFields: FormField<TCampusInfoCreateFormDataType>[] = [
  {
    name: 'name',
    label: 'Name',
    xs: 12,
    sm: 4,
    type: 'text',
    required: true,
  },
  { name: 'email', label: 'Email', xs: 12, sm: 4, type: 'email'},
  { name: 'phone', label: 'Phone', xs: 12, sm: 4, type: 'number'},
  { name: 'location', label: 'Location', xs: 12, sm: 4, type: 'text'},
  {
    name: 'organizationChart',
    label: 'OrganizationChart',
    xs: 12,
    sm: 4,
    type: 'image',
    imageSize: 120
  },
];
