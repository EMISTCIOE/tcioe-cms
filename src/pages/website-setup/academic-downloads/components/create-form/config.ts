import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

// NOTE - Define the schema for the form.
export const academicDownloadsCreateFormSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  file: z
    .any()
    .refine(
      (file) => {
        const f = file instanceof FileList ? file[0] : file;
        return f instanceof File && (f.type.startsWith('image/') || f.type.startsWith('application/'));
      },
      {
        message: 'Only image and application files are allowed'
      }
    )
    .optional()
});

// NOTE - Generate a type from the schema
export type TAcademicDownloadsCreateFormDataType = z.infer<typeof academicDownloadsCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TAcademicDownloadsCreateFormDataType> = {
  department: '',
  title: '',
  description: '',
  isActive: true,
  file: null
};

// NOTE - Define the form fields
export const academicDownloadsCreateFields: FormField<TAcademicDownloadsCreateFormDataType>[] = [
  { name: 'department', label: 'Department', xs: 12, sm: 6, type: 'select', required: true, options: [] },
  { name: 'title', label: 'Title', xs: 12, sm: 6, type: 'text', required: true },
  { name: 'isActive', label: 'Active Status', xs: 2, sm: 2, type: 'switch' },
  {
    name: 'file',
    label: 'File',
    xs: 12,
    sm: 3,
    type: 'file'
  },
  { name: 'description', label: 'Description', xs: 12, sm: 12, type: 'editor' }
];
