import { FormField } from '@/components/app-form/types';
import * as z from 'zod';
import { enumToOptions } from '@/utils/functions/formatString';
import { IReportType } from '../../redux/types';

// NOTE - Define the schema for the form.
export const campusReportsUpdateFormSchema = z.object({
  id: z.number().min(1, 'Academic Calender ID is required'),
  reportType: z.nativeEnum(IReportType, {
    message: 'Report Type is required'
  }),
  fiscalSession: z.number().min(1, 'Fiscal Session is required'),
  publishedDate: z.string().min(1, 'Published date is required'),
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
export type TCampusReportsUpdateFormDataType = z.infer<typeof campusReportsUpdateFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: Partial<TCampusReportsUpdateFormDataType> = {
  id: undefined,
  reportType: undefined,
  fiscalSession: undefined,
  publishedDate: '',
  isActive: true,
  file: null
};

// NOTE - Define the form fields
export const campusReportsUpdateFields: FormField<TCampusReportsUpdateFormDataType>[] = [
  { name: 'reportType', label: 'Report Type', type: 'select', xs: 12, sm: 4, options: enumToOptions(IReportType), required: true },
  { name: 'fiscalSession', label: 'Fiscal Session', type: 'select', xs: 12, sm: 4, options: [], required: true },
  { name: 'publishedDate', label: 'Published Date', type: 'date', xs: 12, sm: 4 },
  { name: 'file', label: 'File', type: 'file', xs: 12, sm: 4 },
  { name: 'isActive', label: 'Active Status', type: 'switch', xs: 12, sm: 4 }
];
