import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

// NOTE - Define the schema for the gallery items
const eventGallerySchema = z.object({
  image: z.any().refine(
    (file) => {
      const f = file instanceof FileList ? file[0] : file;
      return f instanceof File && f.type.startsWith('image/');
    },
    {
      message: 'Only image files are allowed'
    }
  ),
  caption: z.string().optional(),
  isActive: z.boolean()
});

export type EventGallery = z.infer<typeof eventGallerySchema>;

// NOTE - Define the schema for the form.
export const studentClubEventsCreateFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().optional(),
  isActive: z.boolean().default(true),
  club: z.number().min(1, 'Club is required'),
  thumbnail: z.any().refine(
    (file) => {
      if (!file) return true;
      const f = file instanceof FileList ? file[0] : file;
      return f instanceof File && f.type.startsWith('image/');
    },
    {
      message: 'Only image files are allowed'
    }
  ),
  gallery: z.array(eventGallerySchema).optional()
});

// NOTE - Generate a type from the schema
export type TStudentClubEventsCreateFormDataType = z.infer<typeof studentClubEventsCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TStudentClubEventsCreateFormDataType> = {
  title: '',
  description: '',
  date: undefined,
  thumbnail: null,
  club: undefined,
  gallery: [],
  isActive: true
};

// NOTE - Define the form fields
export const studentClubEventsCreateFields: FormField<TStudentClubEventsCreateFormDataType>[] = [
  { name: 'title', label: 'Title', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'date', label: 'Event Date', type: 'date', xs: 12, sm: 4 },
  { name: 'club', label: 'Club', xs: 12, sm: 4, type: 'select', options: [], required: true },
  { name: 'thumbnail', label: 'Thumbnail', type: 'file', accpetFileTypes: 'image/*', xs: 8, sm: 3, required: true },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 4, sm: 2, defaultValue: true },
  { name: 'description', label: 'Description', type: 'editor', xs: 12, sm: 12 },
  {
    name: 'gallery',
    label: 'Gallery',
    type: 'array',
    xs: 12,
    sm: 12,
    itemFields: [
      { name: 'image', label: 'Image', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 3, required: true },
      { name: 'caption', label: 'Caption', type: 'text', xs: 6, sm: 6 },
      { name: 'isActive', label: 'Active Status', type: 'switch', xs: 5, sm: 2, defaultValue: true }
    ] as FormField<EventGallery>[]
  }
];
