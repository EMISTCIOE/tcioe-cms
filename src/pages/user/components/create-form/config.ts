import { FormField } from '@/components/app-form/types';
import * as z from 'zod';

// NOTE - Define the schema for the form.
export const userInfoFormSchema = z
  .object({
    name: z.string().min(1, 'Full Name is required'),
    phoneNo: z.string().min(10, 'Phone No. must be at least 10 characters').optional(),
    email: z.string().email('Invalid email address'),
    isActive: z.boolean().optional(),
    // role of user (EMIS-STAFF, ADMIN, DEPARTMENT-ADMIN, CLUB, UNION)
  role: z.string().optional(),
  // Password is now generated on the backend. Frontend no longer collects password.
  roles: z.array(z.number()).min(1, 'At least one role is required'),
  designation: z.number().optional(),
  department: z.number().optional(),
  club: z.number().optional(),
  union: z.number().optional(),
  campusUnit: z.number().optional(),
  campusSection: z.number().optional(),
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
  })
  .superRefine((data, ctx) => {
    if (data.role === 'CAMPUS-UNIT' && !data.campusUnit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campus Unit is required',
        path: ['campusUnit']
      });
    }
    if (data.role === 'CAMPUS-SECTION' && !data.campusSection) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Campus Section is required',
        path: ['campusSection']
      });
    }
  });

// NOTE - Generate a type from the schema
export type UserInfoFormDataType = z.infer<typeof userInfoFormSchema>;

// NOTE -  Define default Values for the Form using the generated type
export const defaultValues: UserInfoFormDataType = {
  name: '',
  phoneNo: '',
  email: '',
  role: undefined,
  isActive: true,
  roles: [],
  photo: undefined,
  campusUnit: undefined,
  campusSection: undefined
};

// NOTE - Define the form fields
export const userInfoFields: FormField<UserInfoFormDataType>[] = [
  { name: 'name', label: 'Full Name', xs: 6, sm: 3, type: 'text', required: true },
  {
    name: 'role',
    label: 'Account Type',
    xs: 6,
    sm: 3,
    type: 'select',
    options: [
      { label: 'EMIS Staff', value: 'EMIS-STAFF' },
      { label: 'Admin', value: 'ADMIN' },
      { label: 'Department Admin', value: 'DEPARTMENT-ADMIN' },
      { label: 'Club', value: 'CLUB' },
      { label: 'Union', value: 'UNION' },
      { label: 'Campus Unit', value: 'CAMPUS-UNIT' },
      { label: 'Campus Section', value: 'CAMPUS-SECTION' }
    ],
    required: false
  },
  { name: 'phoneNo', label: 'Phone No', xs: 6, sm: 3, type: 'text' },
  { name: 'email', label: 'Email', xs: 6, sm: 3, type: 'email', required: true },
  // show designation for EMIS Staff, Admin and Department Admin
  {
    name: 'designation',
    label: 'Designation',
    xs: 6,
    sm: 3,
    type: 'select',
    options: [],
    required: false,
    showIf: (values: any) => {
      return ['EMIS-STAFF', 'ADMIN', 'DEPARTMENT-ADMIN'].includes(values?.role);
    }
  },
  // show department only when role is department admin
  {
    name: 'department',
    label: 'Department',
    xs: 6,
    sm: 3,
    type: 'select',
    options: [],
    required: false,
    showIf: (values: any) => values?.role === 'DEPARTMENT-ADMIN'
  },
  { name: 'roles', label: 'Roles', xs: 6, sm: 3, type: 'select', options: [], multipleChips: true, required: true },
  // show club only when role is CLUB
  {
    name: 'club',
    label: 'Student Club',
    xs: 6,
    sm: 3,
    type: 'select',
    options: [],
    required: false,
    showIf: (values: any) => values?.role === 'CLUB'
  },
  // show union only when role is UNION
  {
    name: 'union',
    label: 'Campus Union',
    xs: 6,
    sm: 3,
    type: 'select',
    options: [],
    required: false,
    showIf: (values: any) => values?.role === 'UNION'
  },
  // show campus unit only when role is CAMPUS-UNIT
  {
    name: 'campusUnit',
    label: 'Campus Unit',
    xs: 6,
    sm: 3,
    type: 'select',
    options: [],
    required: false,
    showIf: (values: any) => values?.role === 'CAMPUS-UNIT'
  },
  // show campus section only when role is CAMPUS-SECTION
  {
    name: 'campusSection',
    label: 'Campus Section',
    xs: 6,
    sm: 3,
    type: 'select',
    options: [],
    required: false,
    showIf: (values: any) => values?.role === 'CAMPUS-SECTION'
  },
  {
    name: 'isActive',
    label: 'Active Status',
    xs: 4,
    sm: 3,
    type: 'checkbox',
    trueLabel: 'Active',
    falseLabel: 'Inactive'
  },
  { name: 'photo', label: 'Profile Photo', xs: 6, sm: 3, type: 'image', imageSize: 120 }
];

// NOTE - Define the password requirements
export const ReqObj = [
  { text: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { text: 'At least 1 lowercase letter (a-z)', test: (pw: string) => /[a-z]/.test(pw) },
  { text: 'At least 1 uppercase letter (A-Z)', test: (pw: string) => /[A-Z]/.test(pw) },
  { text: 'At least 1 number (0-9)', test: (pw: string) => /[0-9]/.test(pw) },
  { text: 'At least 1 special character', test: (pw: string) => /[!#@$%^&*)(+=._-]/.test(pw) }
];

export const uniqueFieldNames = ['email', 'phoneNo'] as const;
