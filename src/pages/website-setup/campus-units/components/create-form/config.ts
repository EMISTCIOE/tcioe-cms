import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { enumToOptions } from '@/utils/functions/formatString';
import { CampusKeyOfficialsTitleprefix } from '@/pages/website-setup/campus-key-officials/redux/types';

const imageSchema = z
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
  .optional();

// NOTE - Define the schema for the members of the campus unit.
const memberSchema = z.object({
  titlePrefix: z.nativeEnum(CampusKeyOfficialsTitleprefix).optional(),
  fullName: z.string().min(1, 'Full Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  email: z
    .union([z.string().email('Invalid email address'), z.literal('')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  displayOrder: z
    .number({ invalid_type_error: 'Display order must be a number' })
    .int()
    .min(1, 'Display order must be at least 1')
    .optional(),
  photo: imageSchema,
  isActive: z.boolean().default(true)
});

export type Member = z.infer<typeof memberSchema>;

// NOTE - Define the schema for the form.
export const campusUnitsCreateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .union([z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes only'), z.literal('')])
    .optional()
    .transform((value) => (value === '' ? undefined : value?.toLowerCase())),
  shortDescription: z.string().min(1, 'Description is required'),
  detailedDescription: z.string().optional(),
  objectives: z.string().optional(),
  achievements: z.string().optional(),
  location: z.string().optional(),
  contactEmail: z
    .union([z.string().email('Invalid email address'), z.literal('')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  contactPhone: z.string().optional(),
  displayOrder: z
    .number({ invalid_type_error: 'Display order must be a number' })
    .int()
    .min(1, 'Display order must be at least 1')
    .default(1),
  isActive: z.boolean().default(true),
  thumbnail: imageSchema,
  heroImage: imageSchema,
  members: z.array(memberSchema).min(1, 'At least one member is required')
});

// NOTE - Generate a type from the schema
export type TCampusUnitsCreateFormDataType = z.infer<typeof campusUnitsCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusUnitsCreateFormDataType> = {
  name: '',
  slug: '',
  isActive: true,
  shortDescription: '',
  detailedDescription: '',
  objectives: '',
  achievements: '',
  location: '',
  contactEmail: '',
  contactPhone: '',
  displayOrder: 1,
  thumbnail: null,
  heroImage: null,
  members: []
};

// NOTE - Define the form fields
export const campusUnitsCreateFields: FormField<TCampusUnitsCreateFormDataType>[] = [
  { name: 'name', label: 'Unit Name', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'slug', label: 'Slug (optional)', type: 'text', xs: 12, sm: 4 },
  { name: 'displayOrder', label: 'Display Order', type: 'number', xs: 12, sm: 4, required: true },
  { name: 'thumbnail', label: 'Thumbnail', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 4 },
  { name: 'heroImage', label: 'Hero Image', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 4 },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 4, defaultValue: true },
  { name: 'location', label: 'Location', type: 'text', xs: 12, sm: 4 },
  { name: 'contactEmail', label: 'Contact Email', type: 'email', xs: 12, sm: 4 },
  { name: 'contactPhone', label: 'Contact Phone', type: 'text', xs: 12, sm: 4 },
  { name: 'shortDescription', label: 'Short Description', type: 'text', xs: 12, sm: 12, multiline: true, rows: 3, required: true },
  { name: 'detailedDescription', label: 'Detailed Description', type: 'editor', xs: 12, sm: 12 },
  { name: 'objectives', label: 'Objectives', type: 'editor', xs: 12, sm: 12 },
  { name: 'achievements', label: 'Key Achievements', type: 'editor', xs: 12, sm: 12 },
  {
    name: 'members',
    label: 'Members',
    type: 'array',
    xs: 12,
    sm: 12,
    itemFields: [
      {
        name: 'titlePrefix',
        label: 'Title Prefix',
        type: 'select',
        xs: 12,
        sm: 2,
        options: enumToOptions(CampusKeyOfficialsTitleprefix)
      },
      { name: 'fullName', label: 'Full Name', type: 'text', xs: 12, sm: 3, required: true },
      { name: 'designation', label: 'Designation', type: 'text', xs: 12, sm: 3, required: true },
      { name: 'email', label: 'Email', type: 'email', xs: 12, sm: 2 },
      { name: 'phoneNumber', label: 'Phone', type: 'text', xs: 12, sm: 2 },
      { name: 'bio', label: 'Bio', type: 'text', xs: 12, sm: 6, multiline: true, rows: 2 },
      { name: 'displayOrder', label: 'Order', type: 'number', xs: 12, sm: 2 },
      { name: 'photo', label: 'Photo', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 3 },
      { name: 'isActive', label: 'Active', type: 'switch', xs: 12, sm: 2, defaultValue: true }
    ] as FormField<Member>[]
  }
];
