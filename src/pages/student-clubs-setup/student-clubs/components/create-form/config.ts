import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

// NOTE - Define the schema for the members of the campus union.
const memberSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  photo: z
    .any()
    .refine(
      (file) => {
        const f = file instanceof FileList ? file[0] : file;
        return f instanceof File && f.type.startsWith('image/');
      },
      {
        message: 'Only image files are allowed'
      }
    )
    .optional(),
  isActive: z.boolean()
});

export type Member = z.infer<typeof memberSchema>;

// NOTE - Define the schema for the form.
export const studentClubsCreateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  shortDescription: z.string().min(1, 'Short Description is required'),
  detailedDescription: z.string().optional(),
  isActive: z.boolean().default(true),
  thumbnail: z
    .any()
    .refine(
      (file) => {
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
export type TStudentClubsCreateFormDataType = z.infer<typeof studentClubsCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TStudentClubsCreateFormDataType> = {
  name: '',
  shortDescription: '',
  detailedDescription: '',
  thumbnail: null,
  isActive: true,
  members: []
};

// NOTE - Define the form fields
export const studentClubsCreateFields: FormField<TStudentClubsCreateFormDataType>[] = [
  { name: 'name', label: 'Name', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'shortDescription', label: 'Short Description', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'thumbnail', label: 'Thumbnail', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 3 },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 2, defaultValue: true },
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
