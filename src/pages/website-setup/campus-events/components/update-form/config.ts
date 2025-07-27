import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { enumToOptions } from '@/utils/functions/formatString';
import { ICampusEvent } from '../../redux/types';

// NOTE - Define the schema for the gallery items
const eventGallerySchema = z.object({
  id: z.number().optional(),
  image: z.union([z.string().min(1, 'File URL cannot be empty.'), z.any()]).refine(
    (file) => {
      if (typeof file === 'string') {
        return true;
      }
      const f = file instanceof FileList ? file[0] : file;
      return f instanceof File && f.type.startsWith('image/');
    },
    {
      message: 'Only image file or URL is allowed'
    }
  ),
  caption: z.string().optional(),
  isActive: z.boolean().optional()
});

export type EventGallery = z.infer<typeof eventGallerySchema>;

// NOTE - Define the schema for the form.
export const campusEventsUpdateFormSchema = z.object({
  id: z.number().min(1, 'Event ID is required'),
  title: z.string().min(1, 'Title is required'),
  descriptionShort: z.string().min(1, 'Short Description is required'),
  descriptionDetailed: z.string().optional(),
  eventType: z.nativeEnum(ICampusEvent).optional(),
  eventStartDate: z.string().optional(),
  eventEndDate: z.string().optional(),
  // isActive: z.boolean().default(true),
  thumbnail: z
    .union([z.string().min(1, 'File URL cannot be empty.'), z.any()])
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
  gallery: z.array(eventGallerySchema).optional()
});

// NOTE - Generate a type from the schema
export type TCampusEventsUpdateFormDataType = z.infer<typeof campusEventsUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusEventsUpdateFormDataType> = {
  title: '',
  descriptionShort: '',
  descriptionDetailed: '',
  eventType: undefined,
  eventStartDate: undefined,
  eventEndDate: undefined,
  thumbnail: null,
  gallery: [{ image: null, caption: '', isActive: true }]
  // isActive: true
};

// NOTE - Define the form fields
export const campusEventsUpdateFields: FormField<TCampusEventsUpdateFormDataType>[] = [
  { name: 'title', label: 'Title', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'descriptionShort', label: 'Short Description', type: 'text', xs: 12, sm: 4, required: true },
  { name: 'eventType', label: 'Event Type', type: 'select', options: enumToOptions(ICampusEvent) },
  { name: 'descriptionDetailed', label: 'Detailed Description', type: 'editor', xs: 12, sm: 12 },
  { name: 'eventStartDate', label: 'Event Start Date', type: 'date', xs: 12, sm: 4 },
  { name: 'eventEndDate', label: 'Event End Date', type: 'date', xs: 12, sm: 4 },
  { name: 'thumbnail', label: 'Thumbnail', type: 'image', imageSize: 120, xs: 12, sm: 4 },
  {
    name: 'gallery',
    label: 'Gallery',
    type: 'array',
    xs: 12,
    sm: 12,
    itemFields: [
      { name: 'image', label: 'Image', type: 'file', accpetFileTypes: 'image/*', xs: 12, sm: 3, required: true },
      { name: 'caption', label: 'Caption', type: 'text', xs: 6, sm: 6 },
      { name: 'isActive', label: 'Is Active', type: 'switch', xs: 5, sm: 2, defaultValue: true }
    ] as FormField<EventGallery>[]
  }
];
