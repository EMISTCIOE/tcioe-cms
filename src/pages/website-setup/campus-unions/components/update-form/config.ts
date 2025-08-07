import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { enumToOptions } from '@/utils/functions/formatString';

// NOTE - Define the schema for the  members of the campus union.
const memberSchema = z.object({
  id: z.number().optional(),
  fullName: z.string().min(1, 'Full Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  photo: z
    .union([z.string().min(1, 'File URL cannot be empty.'), z.any()])
    .refine(
      (file) => {
        if (typeof file === 'string') {
          return true;
        }
        const f = file instanceof FileList ? file[0] : file;
        return f instanceof File && f.type.startsWith('image/');
      },
      {
        message: 'Only image file or URL is allowed'
      }
    )
    .optional(),
  isActive: z.boolean().optional()
});

export type Member = z.infer<typeof memberSchema>;

// NOTE - Define the schema for the form.
export const campusUnionsUpdateFormSchema = z.object({
  id: z.number().min(1, 'CampusUnion ID is required'),
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Description is required'),
  detailedDescription: z.string().optional(),
  websiteUrl: z.string().url('Invalid URL').optional().nullable(),
  isActive: z.boolean().default(true),
  thumbnail: z
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
    .optional(),
  members: z.array(memberSchema).min(1, 'At least one member is required').optional()
});

// NOTE - Generate a type from the schema
export type TCampusUnionsUpdateFormDataType = z.infer<typeof campusUnionsUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusUnionsUpdateFormDataType> = {
  id: undefined,
  name: '',
  isActive: true,
  shortDescription: '',
  detailedDescription: '',
  thumbnail: null,
  websiteUrl: '',
  members: []
};

// NOTE - Define the form fields
export const campusUnionsUpdateFields: FormField<TCampusUnionsUpdateFormDataType>[] = [
  { name: 'name', label: 'Name', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'websiteUrl', label: 'Website URL', type: 'text', xs: 12, sm: 3 },
  { name: 'thumbnail', label: 'Thumbnail', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 3 },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 2, defaultValue: true },
  { name: 'shortDescription', label: 'Short Description', type: 'text', xs: 12, sm: 12, multiline: true, rows: 4, required: true },
  { name: 'detailedDescription', label: 'Detailed Description', type: 'editor', xs: 12, sm: 12, required: true },
  {
    name: 'members',
    label: 'Members',
    type: 'array',
    xs: 12,
    sm: 12,
    itemFields: [
      { name: 'photo', label: 'Photo', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 3 },
      { name: 'fullName', label: 'Full Name', type: 'text', xs: 6, sm: 3, required: true },
      { name: 'designation', label: 'Designation', type: 'text', xs: 6, sm: 3, required: true },
      { name: 'isActive', label: 'Active Status', type: 'switch', xs: 11, sm: 2, defaultValue: true }
    ] as FormField<Member>[]
  }
];
