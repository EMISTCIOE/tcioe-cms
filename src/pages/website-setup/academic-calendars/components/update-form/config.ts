import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { enumToOptions } from '@/utils/functions/formatString';
import { IProgramType } from '../../redux/types';

// NOTE - Define the schema for the form.
export const academicCalendarsUpdateFormSchema = z.object({
  id: z.number().min(1, 'Academic Calender ID is required'),
  programType: z.nativeEnum(IProgramType, {
    message: 'Program Type is required'
  }),
  startYear: z.union([z.string().min(1, 'Start Year is required'), z.number().min(1, 'Start Year is required')]),
  endYear: z.union([z.string().min(1, 'End Year is required'), z.number().min(1, 'End Year is required')]),
  isActive: z.boolean().default(true),
  file: z
    .union([z.string().min(1, 'File URL cannot be empty.'), z.any()])
    .refine(
      (file) => {
        if (!file) return true;

        if (typeof file === 'string') {
          return true;
        }

        const f = file instanceof FileList ? file[0] : file;
        return f instanceof File && (f.type.startsWith('image/') || f.type.startsWith('application/'));
      },
      {
        message: 'Only image and application files are allowed'
      }
    )
    .optional()
});

// NOTE - Generate a type from the schema
export type TAcademicCalendarsUpdateFormDataType = z.infer<typeof academicCalendarsUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TAcademicCalendarsUpdateFormDataType> = {
  id: undefined,
  programType: undefined,
  startYear: '',
  endYear: '',
  isActive: true,
  file: null
};

// NOTE - Define the form fields
export const academicCalendarsUpdateFields: FormField<TAcademicCalendarsUpdateFormDataType>[] = [
  { name: 'programType', label: 'Program Type', type: 'select', xs: 12, sm: 4, options: enumToOptions(IProgramType), required: true },
  { name: 'startYear', label: 'Start Year', type: 'date', xs: 12, sm: 4, required: true },
  { name: 'endYear', label: 'End Year', type: 'date', xs: 12, sm: 4, required: true },
  { name: 'file', label: 'File', type: 'file', xs: 12, sm: 4 },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 4 }
];
