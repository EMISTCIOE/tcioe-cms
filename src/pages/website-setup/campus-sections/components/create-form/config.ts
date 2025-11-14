import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

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

// NOTE - Define the schema for the form.
export const campusSectionsCreateFormSchema = z
  .object({
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
    members: z.array(z.number({ invalid_type_error: 'Select at least one official' })).min(1, 'Select at least one linked official'),
    departmentHead: z.number().nullable().optional()
  })
  .refine(
    (data) => {
      if (data.departmentHead === null || data.departmentHead === undefined) return true;
      return data.members.includes(data.departmentHead);
    },
    {
      message: 'Selected head must also be part of the linked officials list',
      path: ['departmentHead']
    }
  );

// NOTE - Generate a type from the schema
export type TCampusSectionsCreateFormDataType = z.infer<typeof campusSectionsCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusSectionsCreateFormDataType> = {
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
  members: [],
  departmentHead: undefined
};

// NOTE - Define the form fields
export const campusSectionsCreateFields: FormField<TCampusSectionsCreateFormDataType>[] = [
  { name: 'name', label: 'Section Name', type: 'text', xs: 12, sm: 4, required: true },
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
  { name: 'departmentHead', label: 'Section Head', type: 'select', xs: 12, sm: 6, options: [] },
  { name: 'members', label: 'Linked Officials', type: 'select', xs: 12, sm: 12, multipleChips: true, options: [], required: true }
];
