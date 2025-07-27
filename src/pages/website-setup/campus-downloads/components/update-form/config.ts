import * as z from 'zod';
import { FormField } from '@/components/app-form/types';

// NOTE - Define the schema for the form.
export const campusDownloadsUpdateFormSchema = z.object({
  id: z.number().min(1, 'Campus Downloads is required'),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  file: z
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
        message: 'Only image files are allowed'
      }
    )
    .optional()
});

// NOTE - Generate a type from the schema
export type TCampusDownloadsUpdateFormDataType = z.infer<typeof campusDownloadsUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusDownloadsUpdateFormDataType> = {
  title: '',
  description: '',
  isActive: true,
  file: null
};

// NOTE - Define the form fields
export const campusDownloadsUpdateFields: FormField<TCampusDownloadsUpdateFormDataType>[] = [
  { name: 'title', label: 'Title', xs: 12, sm: 4, type: 'text', required: true },
  { name: 'description', label: 'Description', xs: 12, sm: 4, type: 'text' },
  { name: 'isActive', label: 'Active Status', xs: 2, sm: 2, type: 'switch' },
  {
    name: 'file',
    label: 'File',
    xs: 12,
    sm: 12,
    type: 'image',
    imageSize: 120
  }
];
