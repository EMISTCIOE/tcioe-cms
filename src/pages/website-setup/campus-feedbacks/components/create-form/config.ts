import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { enumToOptions } from '@/utils/functions/formatString';
import { CampusKeyOfficialsTitleprefix } from '../../../campus-key-officials/redux/types';

// NOTE - Define the schema for the form.
export const campusKeyOfficialsCreateFormSchema = z.object({
  titlePrefix: z.nativeEnum(CampusKeyOfficialsTitleprefix, {
    errorMap: () => ({ message: 'Title Prefix is required' })
  }),
  designation: z.string().min(1, 'Designation is required'),
  fullName: z.string().min(1, 'FullName is required'),
  email: z.string().email('Invalid email address').optional(),
  message: z.string().optional(),
  phoneNumber: z.string().min(10, 'Phone Number must be at least 10 characters').optional(),
  isKeyOfficial: z.boolean().default(true),
  isActive: z.boolean().default(true),
  photo: z
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
    .optional()
});

// NOTE - Generate a type from the schema
export type TCampusKeyOfficialsCreateFormDataType = z.infer<typeof campusKeyOfficialsCreateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusKeyOfficialsCreateFormDataType> = {
  titlePrefix: undefined,
  designation: undefined,
  fullName: '',
  email: '',
  message: '',
  phoneNumber: '',
  isKeyOfficial: true,
  isActive: true,
  photo: null
};

// NOTE - Define the form fields
export const campusKeyOfficialsCreateFields: FormField<TCampusKeyOfficialsCreateFormDataType>[] = [
  {
    name: 'designation',
    label: 'Designation',
    xs: 12,
    sm: 4,
    type: 'select',
    required: true,
    options: []
  },
  {
    name: 'titlePrefix',
    label: 'Title Prefix',
    xs: 12,
    sm: 4,
    type: 'select',
    required: true,
    options: [...enumToOptions(CampusKeyOfficialsTitleprefix)]
  },
  { name: 'fullName', label: 'Full Name', xs: 12, sm: 4, type: 'text', required: true },
  { name: 'email', label: 'Email', xs: 12, sm: 4, type: 'email' },
  { name: 'phoneNumber', label: 'Phone Number', xs: 12, sm: 4, type: 'text' },
  { name: 'isKeyOfficial', label: 'Key Official', xs: 2, sm: 2, type: 'switch', defaultValue: true },
  { name: 'isActive', label: 'Active Status', xs: 2, sm: 2, type: 'switch' },
  { name: 'message', label: 'Message', xs: 12, sm: 12, type: 'editor', multiline: true, rows: 5 },
  {
    name: 'photo',
    label: 'Photo',
    xs: 12,
    sm: 12,
    type: 'image',
    imageSize: 120
  }
];
