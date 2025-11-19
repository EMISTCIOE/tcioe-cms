import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

// NOTE - Schema definition for media item
export const mediaSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  file: z.any().refine(
    (file) => {
      if (!file) return true;
      const f = file instanceof FileList ? file[0] : file;
      return f instanceof File && (f.type.startsWith('image/') || f.type.startsWith('application/'));
    },
    {
      message: 'Only image and document files are allowed'
    }
  ),
  caption: z.string().optional()
});

export type Media = z.infer<typeof mediaSchema>;

// NOTE - Define the schema for the form.
export const noticeCreateFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.union([z.number(), z.string()]).nullable(),
  category: z.union([z.number(), z.string()]),
  description: z.string().optional(),
  isFeatured: z.boolean().default(true),
  isDraft: z.boolean().default(false),
  thumbnail: z
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
    .optional(),
  isApprovedByDepartment: z.boolean().optional(),
  isApprovedByCampus: z.boolean().optional(),
  medias: z.array(mediaSchema).optional()
});

// NOTE - Generate a type from the schema
export type TNoticeCreateFormDataType = z.infer<typeof noticeCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TNoticeCreateFormDataType> = {
  title: '',
  department: null,
  category: undefined,
  description: '',
  isFeatured: true,
  isDraft: false,
  thumbnail: null,
  medias: [{ file: null, caption: '' }],
  isApprovedByDepartment: false,
  isApprovedByCampus: false
};

// NOTE - Define the form fields with improved layout
export const noticeCreateFields: FormField<TNoticeCreateFormDataType>[] = [
  {
    name: 'title',
    label: 'Title',
    xs: 12,
    sm: 12,
    type: 'text',
    multiline: true,
    rows: 2,
    required: true,
    inputStyle: { fontSize: '1rem' }
  },
  { name: 'department', label: 'Department', xs: 12, sm: 6, type: 'select', options: [] },
  { name: 'category', label: 'Category', xs: 12, sm: 6, type: 'select', options: [], required: true },
  { name: 'description', label: 'Description', xs: 12, sm: 12, type: 'editor', multiline: true, rows: 4 },
  {
    name: 'thumbnail',
    label: 'Thumbnail',
    xs: 12,
    sm: 6,
    type: 'image',
    imageSize: 100
  },
  {
    name: 'medias',
    label: 'Attachments',
    type: 'array',
    required: false,
    xs: 12,
    sm: 6,
    itemFields: [
      {
        name: 'file',
        label: 'File',
        type: 'file',
        xs: 12,
        sm: 5,
        required: true
      },
      { name: 'caption', label: 'Caption', type: 'text', xs: 12, sm: 7 }
    ] as FormField<Media>[]
  },
  { name: 'isFeatured', label: 'Featured', xs: 6, sm: 3, type: 'switch' },
  { name: 'isDraft', label: 'Draft', xs: 6, sm: 3, type: 'switch' },
  { name: 'isApprovedByDepartment', label: 'Approved by Dept', xs: 6, sm: 3, type: 'switch' },
  { name: 'isApprovedByCampus', label: 'Approved by Campus', xs: 6, sm: 3, type: 'switch' }
];
