import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

const fileOrStringSchema = z
  .union([z.string().min(1, 'File URL cannot be empty.'), z.any()])
  .refine(
    (file) => {
      if (!file) return true;
      if (typeof file === 'string') {
        return true;
      }
      const f = file instanceof FileList ? file[0] : file;
      return f instanceof File && f.type.startsWith('image/');
    },
    {
      message: 'Only image files or URLs are allowed'
    }
  )
  .optional();

// NOTE - Define the schema for the form.
export const departmentUpdateFormSchema = z.object({
  id: z.number().min(1, 'Department ID is required'),
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().optional(),
  slug: z
    .union([z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes only'), z.literal('')])
    .optional()
    .transform((value) => (value === '' ? undefined : value?.toLowerCase())),
  briefDescription: z.string().optional(),
  detailedDescription: z.string().optional(),
  phoneNo: z.string().optional(),
  email: z
    .union([z.string().email('Invalid email address'), z.literal('')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  isActive: z.boolean().default(true),
  thumbnail: fileOrStringSchema
});

// NOTE - Generate a type from the schema
export type TDepartmentUpdateFormDataType = z.infer<typeof departmentUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TDepartmentUpdateFormDataType> = {
  id: 0,
  name: '',
  shortName: '',
  slug: '',
  isActive: true,
  briefDescription: '',
  detailedDescription: '',
  phoneNo: '',
  email: '',
  thumbnail: null
};

// NOTE - Define the form fields
export const departmentUpdateFields: FormField<TDepartmentUpdateFormDataType>[] = [
  { name: 'name', label: 'Department Name', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'shortName', label: 'Short Name', type: 'text', xs: 12, sm: 4 },
  { name: 'slug', label: 'Slug (optional)', type: 'text', xs: 12, sm: 4 },
  { name: 'thumbnail', label: 'Thumbnail', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 6 },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 6, defaultValue: true },
  { name: 'phoneNo', label: 'Phone Number', type: 'text', xs: 12, sm: 6 },
  { name: 'email', label: 'Email', type: 'email', xs: 12, sm: 6 },
  { name: 'briefDescription', label: 'Brief Description', type: 'text', xs: 12, sm: 12, multiline: true, rows: 3 },
  { name: 'detailedDescription', label: 'Detailed Description', type: 'editor', xs: 12, sm: 12 }
];
