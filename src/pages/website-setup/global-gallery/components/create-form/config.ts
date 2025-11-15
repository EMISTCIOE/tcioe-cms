import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

const imageSchema = z.object({
  image: z.any().refine(
    (file) => {
      const target = file instanceof FileList ? file[0] : file;
      return target instanceof File && target.type.startsWith('image/');
    },
    {
      message: 'Image file is required'
    }
  ),
  caption: z.string().optional(),
  displayOrder: z.number().int().positive().optional()
});

export type TGalleryImage = z.infer<typeof imageSchema>;

export const globalGalleryCreateFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  campusEvent: z.number().nullable().optional(),
  studentClubEvent: z.number().nullable().optional(),
  departmentEvent: z.number().nullable().optional(),
  union: z.number().nullable().optional(),
  club: z.number().nullable().optional(),
  department: z.number().nullable().optional(),
  isActive: z.boolean().default(true),
  images: z.array(imageSchema).min(1, 'Add at least one gallery image')
});

export type TGlobalGalleryCreateFormDataType = z.infer<typeof globalGalleryCreateFormSchema>;

export const defaultValues: Partial<TGlobalGalleryCreateFormDataType> = {
  title: '',
  description: '',
  campusEvent: null,
  studentClubEvent: null,
  departmentEvent: null,
  union: null,
  club: null,
  department: null,
  isActive: true,
  images: []
};

export const globalGalleryCreateFields: FormField<TGlobalGalleryCreateFormDataType>[] = [
  { name: 'title', label: 'Title', type: 'text', xs: 12, sm: 6 },
  { name: 'description', label: 'Description', type: 'editor', xs: 12, sm: 12 },
  { name: 'campusEvent', label: 'Campus Event', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'studentClubEvent', label: 'Student Club Event', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'departmentEvent', label: 'Department Event', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'union', label: 'Union', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'club', label: 'Club', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'department', label: 'Department', type: 'select', xs: 12, sm: 4, options: [] },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 2 },
  {
    name: 'images',
    label: 'Gallery Images',
    type: 'array',
    xs: 12,
    sm: 12,
    itemFields: [
      { name: 'image', label: 'Image', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 4, required: true },
      { name: 'caption', label: 'Caption', type: 'text', xs: 12, sm: 4 },
      { name: 'displayOrder', label: 'Display Order', type: 'number', xs: 12, sm: 2 }
    ] as FormField<TGalleryImage>[]
  }
];
