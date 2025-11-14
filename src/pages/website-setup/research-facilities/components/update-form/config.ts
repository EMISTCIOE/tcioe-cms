import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

const fileOrStringSchema = z
  .union([z.string().regex(/^https?:\/\/.+/, 'Invalid URL provided'), z.any()])
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

export const researchFacilitiesUpdateFormSchema = z.object({
  id: z.number().min(1, 'Facility ID is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z
    .union([z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes only'), z.literal('')])
    .optional()
    .transform((value) => (value === '' ? undefined : value?.toLowerCase())),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().optional(),
  objectives: z.string().optional(),
  displayOrder: z.number().int().min(1, 'Display order must be at least 1'),
  isActive: z.boolean().default(true),
  thumbnail: fileOrStringSchema
});

export type TResearchFacilitiesUpdateFormDataType = z.infer<typeof researchFacilitiesUpdateFormSchema>;

export const defaultValues: Partial<TResearchFacilitiesUpdateFormDataType> = {
  id: undefined,
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  objectives: '',
  displayOrder: 1,
  isActive: true,
  thumbnail: null
};

export const researchFacilitiesUpdateFields: FormField<TResearchFacilitiesUpdateFormDataType>[] = [
  { name: 'name', label: 'Facility Name', type: 'text', xs: 12, sm: 6, required: true },
  { name: 'slug', label: 'Slug (optional)', type: 'text', xs: 12, sm: 6 },
  { name: 'displayOrder', label: 'Display Order', type: 'number', xs: 12, sm: 6, required: true },
  { name: 'thumbnail', label: 'Display Image', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 6 },
  { name: 'isActive', label: 'Active', type: 'switch', xs: 12, sm: 6, defaultValue: true },
  { name: 'shortDescription', label: 'Short Description', type: 'text', xs: 12, sm: 12, multiline: true, rows: 3, required: true },
  { name: 'description', label: 'Detailed Description', type: 'editor', xs: 12, sm: 12 },
  { name: 'objectives', label: 'Objectives', type: 'editor', xs: 12, sm: 12 }
];
