import * as z from 'zod';
import { FormField } from '@/components/app-form/types';
import { enumToOptions } from '@/utils/functions/formatString';
import { SocialPlatform } from '../redux/types';

export const socialLinksSchema = z.object({
  id: z.number().optional(),
  url: z.string().min(1, 'Url is required'),
  platform: z.nativeEnum(SocialPlatform, {
    errorMap: () => ({ message: 'Platform is required' })
  }),
  isActive: z.boolean().default(true)
});

export type Media = z.infer<typeof socialLinksSchema>;

// NOTE - Define the schema for the form.
export const campusInfoUpdateFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  location: z.string().optional(),
  phoneNumber: z.string().min(10, 'Phone Number must be at least 10 characters').optional(),
  organizationChart: z
    .union([z.string().min(1, 'Photo URL cannot be empty.'), z.any()])
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
  socialLinks: z.array(socialLinksSchema).optional()
});

// NOTE - Generate a type from the schema
export type TCampusInfoUpdateFormDataType = z.infer<typeof campusInfoUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusInfoUpdateFormDataType> = {
  name: '',
  phoneNumber: '',
  email: '',
  location: '',
  organizationChart: null,
  socialLinks: undefined
};

// NOTE - Define the form fields
export const campusInfoUpdateFields: FormField<TCampusInfoUpdateFormDataType>[] = [
  { name: 'name', label: 'Name', xs: 12, sm: 4, type: 'text' },
  { name: 'email', label: 'Email', xs: 12, sm: 4, type: 'email' },
  { name: 'phoneNumber', label: 'Phone Number', xs: 12, sm: 4, type: 'text' },
  { name: 'location', label: 'Location', xs: 12, sm: 4, type: 'text' },
  {
    name: 'organizationChart',
    label: 'Organization Chart',
    xs: 12,
    sm: 12,
    type: 'image',
    imageSize: 120
  },
  {
    name: 'socialLinks',
    label: 'Social Links',
    type: 'array',
    xs: 12,
    sm: 12,
    allowDuplicates: false,
    itemFields: [
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        xs: 12,
        sm: 4,
        options: [...enumToOptions(SocialPlatform)],
        required: true
      },
      { name: 'url', label: 'Url', type: 'text', xs: 11, sm: 4, required: true },
      { name: 'isActive', label: 'Active Status', xs: 2, sm: 2, type: 'switch', required: true, defaultValue: true }
    ] as FormField<Media>[]
  }
];
