import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { MediaType } from '../../redux/types';
import { enumToOptions } from '@/utils/functions/formatString';

// NOTE - Schema definition for media item
export const mediaSchema = z.object({
  id: z.number().optional(),
  file: z.any().refine(
    (file) => {
      if (!file) return true;
      const f = file instanceof FileList ? file[0] : file;
      return f instanceof File && (f.type.startsWith('image/') || f.type.startsWith('application/pdf'));
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
  category: z.number().min(1, 'Category is required'),
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
  medias: [{ file: null, caption: '' }]
};

// NOTE - Define the form fields
export const noticeCreateFields: FormField<TNoticeCreateFormDataType>[] = [
  {
    name: 'title',
    label: 'Title',
    xs: 12,
    sm: 12,
    type: 'text',
    multiline: true,
    rows: 3,
    required: true,
    inputStyle: { fontSize: '1rem' }
  },
  { name: 'description', label: 'Description', xs: 12, sm: 12, type: 'editor', multiline: true, rows: 5 },
  { name: 'department', label: 'Department', xs: 8, sm: 5, type: 'select', options: [] },
  { name: 'category', label: 'Category', xs: 4, sm: 3, type: 'select', options: [], required: true },
  { name: 'isFeatured', label: 'Mark As Featured', xs: 2, sm: 2, type: 'switch' },
  { name: 'isDraft', label: 'Mark As Draft', xs: 2, sm: 2, type: 'switch' },
  {
    name: 'thumbnail',
    label: 'Thumbnail',
    xs: 12,
    sm: 12,
    type: 'image',
    imageSize: 120
  },
  {
    name: 'medias',
    label: 'Attachments',
    type: 'array',
    required: false,
    xs: 12,
    sm: 12,
    // maxSelectable:4,
    itemFields: [
      {
        name: 'file',
        label: 'File',
        type: 'file',
        xs: 12,
        sm: 3,
        required: true
      },
      { name: 'caption', label: 'Caption', type: 'text', xs: 11, sm: 8 }
    ] as FormField<Media>[]
  }
];
