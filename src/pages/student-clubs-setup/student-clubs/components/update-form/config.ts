import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

// NOTE - Define the schema for the members of the campus union.
const memberSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().min(1, 'Full Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  photo: z
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
  isActive: z.boolean().optional()
});

export type Member = z.infer<typeof memberSchema>;

// NOTE - Define the schema for the form.
export const studentClubsUpdateFormSchema = z.object({
  id: z.string().min(1, 'Student Club ID is required'),
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Short Description is required'),
  detailedDescription: z.string().optional(),
  websiteUrl: z.string().url('Invalid URL').optional().nullable(),
  department: z.string().min(1, 'Department is required').nullable().optional(),
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
  members: z.array(memberSchema).min(1, 'At least one member is required')
});

// NOTE - Generate a type from the schema
export type TStudentClubsUpdateFormDataType = z.infer<typeof studentClubsUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TStudentClubsUpdateFormDataType> = {
  name: '',
  shortDescription: '',
  detailedDescription: '',
  websiteUrl: '',
  department: null,
  thumbnail: null,
  isActive: true,
  members: []
};

// NOTE - Define the form fields
export const studentClubsUpdateFields: FormField<TStudentClubsUpdateFormDataType>[] = [
  { name: 'name', label: 'Name', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'department', label: 'Department', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'websiteUrl', label: 'Website URL', type: 'text', xs: 12, sm: 3 },
  { name: 'thumbnail', label: 'Thumbnail', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 3 },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 2, defaultValue: true },
  { name: 'shortDescription', label: 'Short Description', type: 'text', xs: 12, sm: 12, multiline: true, rows: 4, required: true },
  { name: 'detailedDescription', label: 'Detailed Description', type: 'editor', xs: 12, sm: 12 },
  {
    name: 'members',
    label: 'Members',
    type: 'array',
    xs: 12,
    sm: 12,
    required: true,
    itemFields: [
      { name: 'photo', label: 'Photo', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 3 },
      { name: 'fullName', label: 'Full Name', type: 'text', xs: 6, sm: 3, required: true },
      { name: 'designation', label: 'Designation', type: 'text', xs: 6, sm: 3, required: true },
      { name: 'isActive', label: 'Active Status', type: 'switch', xs: 11, sm: 2, defaultValue: true }
    ] as FormField<Member>[]
  }
];
