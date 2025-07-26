import * as z from 'zod';
import { FormField } from '@/components/app-form/types';
import { enumToOptions } from '@/utils/functions/formatString';
import { CampusKeyOfficialsDesignation, CampusKeyOfficialsTitleprefix } from '../../redux/types';

// NOTE - Define the schema for the form.
export const campusKeyOfficialsUpdateFormSchema = z.object({
  id: z.number().min(1, 'Campus key Official is required'),
  titlePrefix: z
    .nativeEnum(CampusKeyOfficialsTitleprefix, {
      errorMap: () => ({ message: 'Title Prefix is required' })
    })
    .optional(),
  designation: z
    .nativeEnum(CampusKeyOfficialsDesignation, {
      errorMap: () => ({ message: 'Designation is required' })
    })
    .optional(),
  fullName: z.string().min(1, 'FullName is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  message: z.string().optional(),
  phoneNumber: z.string().min(10, 'Phone Number must be at least 10 characters').optional(),
  isActive: z.boolean().default(true),
  photo: z
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
    .optional()
});

// NOTE - Generate a type from the schema
export type TCampusKeyOfficialsUpdateFormDataType = z.infer<typeof campusKeyOfficialsUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusKeyOfficialsUpdateFormDataType> = {
  titlePrefix: undefined,
  designation: undefined,
  fullName: '',
  email: '',
  message: '',
  phoneNumber: '',
  isActive: true,
  photo: null
};

// NOTE - Define the form fields
export const campusKeyOfficialsUpdateFields: FormField<TCampusKeyOfficialsUpdateFormDataType>[] = [
  {
    name: 'designation',
    label: 'Designation',
    xs: 12,
    sm: 4,
    type: 'select',
    required: true,
    options: [...enumToOptions(CampusKeyOfficialsDesignation)]
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
