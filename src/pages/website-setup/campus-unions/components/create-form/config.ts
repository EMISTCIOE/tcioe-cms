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
export const campusUnionsCreateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  isActive: z.boolean().default(true),
  members: z.array(memberSchema).min(1, 'At least one member is required')
});

// NOTE - Generate a type from the schema
export type TCampusUnionsCreateFormDataType = z.infer<typeof campusUnionsCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusUnionsCreateFormDataType> = {
  name: '',
  isActive: true,
  description: '',
  members: []
};

// NOTE - Define the form fields
export const campusUnionsCreateFields: FormField<TCampusUnionsCreateFormDataType>[] = [
  { name: 'name', label: 'Name', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 2, defaultValue: true },
  { name: 'description', label: 'Description', type: 'editor', xs: 12, sm: 12, required: true },
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
