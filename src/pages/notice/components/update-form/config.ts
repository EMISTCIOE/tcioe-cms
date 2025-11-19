import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { MediaType, NoticeStatus } from '../../redux/types';

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
  title: z.string().min(1, 'Title is required'),
  department: z.union([z.number(), z.string()]).nullable(),
  category: z.number().min(1, 'Category is required').optional(),
  description: z.string().optional(),
  isFeatured: z.boolean().default(true).optional(),
  isDraft: z.boolean().default(false).optional(),
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
  department: null,
  category: undefined,
  description: '',
  isFeatured: true,
  status: NoticeStatus.PENDING,
  isDraft: false,
  thumbnail: null,
  medias: [{ file: null, caption: '', mediaType: MediaType.DOCUMENT }]
};

// NOTE - Define the form fields with improved layout
export const noticeUpdateFields: FormField<TNoticeUpdateFormDataType>[] = [
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
  { name: 'department', label: 'Department', xs: 12, sm: 6, type: 'select', options: [], required: false },
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
  { name: 'isDraft', label: 'Draft', xs: 6, sm: 3, type: 'switch', showIf: (formData) => formData.status === NoticeStatus.DRAFT }
];
