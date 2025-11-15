import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { globalGalleryCreateFields } from '../create-form/config';

const updateImageSchema = z.object({
  id: z.number().optional(),
  image: z.union([z.string().min(1, 'Image URL cannot be empty.'), z.any()]).refine(
    (file) => {
      if (!file) return true;
      if (typeof file === 'string') return true;
      const target = file instanceof FileList ? file[0] : file;
      return target instanceof File && target.type.startsWith('image/');
    },
    {
      message: 'Only image files or existing URLs are allowed'
    }
  ),
  caption: z.string().optional(),
  displayOrder: z.number().int().positive().optional()
});

export type TUpdateGalleryImage = z.infer<typeof updateImageSchema>;

export const globalGalleryUpdateFormSchema = z.object({
  id: z.number().min(1, 'Gallery collection ID is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  campusEvent: z.number().nullable().optional(),
  studentClubEvent: z.number().nullable().optional(),
  departmentEvent: z.number().nullable().optional(),
  union: z.number().nullable().optional(),
  club: z.number().nullable().optional(),
  department: z.number().nullable().optional(),
  isActive: z.boolean().default(true),
  images: z.array(updateImageSchema).min(1, 'At least one image is required')
});

export type TGlobalGalleryUpdateFormDataType = z.infer<typeof globalGalleryUpdateFormSchema>;

export const galleryUpdateDefaultValues: Partial<TGlobalGalleryUpdateFormDataType> = {
  id: undefined,
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

export const globalGalleryUpdateFields: FormField<TGlobalGalleryUpdateFormDataType>[] = [
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
      { name: 'id', label: 'Image ID', type: 'hidden', xs: 0, sm: 0 },
      { name: 'image', label: 'Image', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 4 },
      { name: 'caption', label: 'Caption', type: 'text', xs: 12, sm: 4 },
      { name: 'displayOrder', label: 'Display Order', type: 'number', xs: 12, sm: 2 }
    ] as FormField<TUpdateGalleryImage>[]
  }
];
