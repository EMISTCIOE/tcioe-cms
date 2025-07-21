import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { MediaType, NoticeStatus } from '../../redux/types';
import { enumToOptions } from '@/utils/functions/formatString';

// NOTE - Schema definition for media item
export const mediaSchema = z.object({
  id: z.number().optional(),
  file: z.union([z.string().min(1, 'File URL cannot be empty.'), z.any()]).refine(
    (file) => {
      if (typeof file === 'string') {
        return true;
      }
      const f = file instanceof FileList ? file[0] : file;

      // Ensure it's a File object and its type
      return f instanceof File && (f.type.startsWith('image/') || f.type === 'application/pdf');
    },
    {
      message: 'A file or a valid file URL is required, and only image/PDF files are allowed.'
    }
  ),
  caption: z.string().optional(),
  mediaType: z
    .enum([MediaType.IMAGE, MediaType.DOCUMENT], {
      required_error: 'Media type is required',
      invalid_type_error: 'Invalid media type'
    })
    .default(MediaType.DOCUMENT)
});

export type Media = z.infer<typeof mediaSchema>;

// NOTE - Define the schema for the form.
export const noticeUpdateFormSchema = z.object({
  id: z.number().min(1, 'Notice ID is required'),
  title: z.string().optional(),
  department: z.number().min(1, 'Department is required').optional(),
  category: z.number().min(1, 'Category is required').optional(),
  description: z.string().optional(),
  isFeatured: z.boolean().default(true).optional(),
  isDraft: z.boolean().default(true).optional(),
  status: z.nativeEnum(NoticeStatus).default(NoticeStatus.PENDING).optional(),
  thumbnail: z
    .union([z.string().min(1, 'Thumbnail URL cannot be empty.'), z.any()])
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
        message: 'Only image files are allowed'
      }
    )
    .optional(),
  medias: z.array(mediaSchema).optional()
});

// NOTE - Generate a type from the schema
export type TNoticeUpdateFormDataType = z.infer<typeof noticeUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TNoticeUpdateFormDataType> = {
  title: '',
  department: undefined,
  category: undefined,
  description: '',
  isFeatured: true,
  status: NoticeStatus.PENDING,
  isDraft: false,
  thumbnail: null,
  medias: [{ file: null, caption: '', mediaType: MediaType.DOCUMENT }]
};

// NOTE - Define the form fields
export const noticeUpdateFields: FormField<TNoticeUpdateFormDataType>[] = [
  { name: 'title', label: 'Title', xs: 12, sm: 12, type: 'text', multiline: true, rows: 2 },
  { name: 'description', label: 'Description', xs: 12, sm: 12, type: 'text', multiline: true, rows: 2 },
  { name: 'department', label: 'Department', xs: 6, sm: 4, type: 'select', options: [], required: true },
  { name: 'category', label: 'Category', xs: 6, sm: 4, type: 'select', options: [], required: true },
  { name: 'isDraft', label: 'SaveAs Draft', xs: 2, sm: 2, type: 'switch', showIf: (formData) => formData.status === NoticeStatus.DRAFT },
  { name: 'isFeatured', label: 'SaveAs Featured', xs: 2, sm: 2, type: 'switch' },
  {
    name: 'thumbnail',
    label: 'Thumbnail',
    xs: 4,
    sm: 2,
    type: 'image',
    imageSize: 90
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
        required: true
      },
      { name: 'caption', label: 'Caption', type: 'text', xs: 6, sm: 4 }
    ] as FormField<Media>[]
  }
];
