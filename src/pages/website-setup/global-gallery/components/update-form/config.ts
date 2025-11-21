import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

export const globalGalleryUpdateFormSchema = z.object({
  id: z.number().min(1, 'Image ID is required'),
  sourceTitle: z.string().optional(),
  sourceContext: z.string().optional(),
  globalEvent: z.union([z.string(), z.number()]).nullable().optional(),
  union: z.union([z.string(), z.number()]).nullable().optional(),
  club: z.union([z.string(), z.number()]).nullable().optional(),
  department: z.union([z.string(), z.number()]).nullable().optional(),
  unit: z.union([z.string(), z.number()]).nullable().optional(),
  section: z.union([z.string(), z.number()]).nullable().optional(),
  isActive: z.boolean().default(true),
  caption: z.string().optional(),
  displayOrder: z.number().int().positive().optional(),
  image: z.union([z.instanceof(File), z.string()]).optional()
});

export type TGlobalGalleryUpdateFormDataType = z.infer<typeof globalGalleryUpdateFormSchema>;

export const galleryUpdateDefaultValues: Partial<TGlobalGalleryUpdateFormDataType> = {
  id: undefined,
  sourceTitle: '',
  sourceContext: '',
  globalEvent: null,
  union: null,
  club: null,
  department: null,
  unit: null,
  section: null,
  isActive: true,
  caption: '',
  displayOrder: 1,
  image: ''
};

export const globalGalleryUpdateFields: FormField<TGlobalGalleryUpdateFormDataType>[] = [
  { name: 'sourceTitle', label: 'Source Title', type: 'text', xs: 12, sm: 6 },
  { name: 'sourceContext', label: 'Source Context', type: 'text', xs: 12, sm: 6 },
  { name: 'globalEvent', label: 'Global Event', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'union', label: 'Union', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'club', label: 'Club', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'department', label: 'Department', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'unit', label: 'Campus Unit', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'section', label: 'Campus Section', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 2 },
  { name: 'caption', label: 'Caption', type: 'text', xs: 12, sm: 6 },
  { name: 'displayOrder', label: 'Display Order', type: 'number', xs: 12, sm: 4 },
  { name: 'image', label: 'Replace Image', type: 'file', xs: 12, sm: 6, accpetFileTypes: 'image/*' }
];
