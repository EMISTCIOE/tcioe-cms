import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { MediaType } from '../../redux/types';
import { enumToOptions } from '@/utils/functions/formatString';


// NOTE - Schema definition for media item
export const mediaSchema = z.object({
  id: z.number().optional(),
  file: z
    .any()
    .refine(
      (file) => {
        if (!file) return true;
        const f = file instanceof FileList ? file[0] : file;
        return f instanceof File && (f.type.startsWith('image/') || f.type.startsWith('application/pdf'));
      },
      {
        message: 'Only image and document files are allowed'
      }
    ),
  caption: z.string().optional(),
  mediaType: z.enum([MediaType.IMAGE, MediaType.DOCUMENT], {
    required_error: 'Media type is required'
  }),
});

export type Media = z.infer<typeof mediaSchema>;

// NOTE - Define the schema for the form.
export const noticeCreateFormSchema = z.object({
  title: z.string().optional(),
  department: z.number().min(1, 'Department is required'),
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
  medias: z.array(mediaSchema).optional(),
});

// NOTE - Generate a type from the schema
export type TNoticeCreateFormDataType = z.infer<typeof noticeCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TNoticeCreateFormDataType> = {
  title: '',
  department: undefined,
  category: undefined,
  description: '',
  isFeatured: true,
  isDraft: false,
  thumbnail: null,
  medias: [{ file: null, caption: '', mediaType: MediaType.IMAGE }],
};

// NOTE - Define the form fields
export const noticeCreateFields: FormField<TNoticeCreateFormDataType>[] = [
  { name: 'title', label: 'Title', xs: 6, sm: 6, type: 'text', multiline: true, rows: 2 },
  { name: 'description', label: 'Description', xs: 6, sm: 6, type: 'text', multiline: true, rows: 2 },
  { name: 'department', label: 'Department', xs: 6, sm: 4, type: 'select', options: [], required: true },
  { name: 'category', label: 'Category', xs: 6, sm: 2, type: 'select', options: [], required: true },
  { name: 'isFeatured', label: 'SaveAs Featured', xs: 2, sm: 2, type: 'switch' },
  { name: 'isDraft', label: 'SaveAs Draft', xs: 2, sm: 2, type: 'switch' },
  {
    name: 'thumbnail',
    label: 'Thumbnail',
    xs: 4,
    sm: 2,
    type: 'image',
    imageSize: 90,
  },
  {
    name: 'medias',
    label: 'Media Files',
    type: 'array',
    required: false,
    xs: 12,
    sm: 12,
    itemFields: [
      {
        name: 'file',
        label: 'File',
        type: 'file',
        imageSize: 80,
        xs: 12,
        sm: 3,
        required: true,
      },
      { name: 'caption', label: 'Caption', type: 'text', xs: 6, sm: 3 },
      {
        name: 'mediaType', label: 'Media Type', type: 'select', xs: 5, sm: 2,
        options: enumToOptions(MediaType), allowDuplicates: true, required: true
      }
    ] as FormField<Media>[]
  }
];
