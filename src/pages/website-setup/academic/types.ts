import { IListResponse } from '@/globals';

export interface IDepartmentSummary {
  id: string;
  name: string;
  short_name?: string;
}

export interface IAcademicProgramLite {
  uuid: string;
  name: string;
  short_name?: string;
  slug: string;
}

export interface IAcademicProgram {
  id: string;
  name: string;
  short_name: string;
  description: string;
  program_type: string;
  department: IDepartmentSummary;
  thumbnail?: string | null;
  is_active: boolean;
}

export interface IAcademicProgramListResponse extends IListResponse {
  results: IAcademicProgram[];
}

export interface IAcademicProgramFilters {
  limit: number;
  offset: number;
  search?: string;
  department?: string;
}

export interface IAcademicProgramCreatePayload {
  name: string;
  short_name?: string;
  description?: string;
  program_type: string;
  department: number;
  thumbnail?: File | null;
}

export interface IAcademicProgramUpdatePayload extends IAcademicProgramCreatePayload {
  id: string;
  is_active?: boolean;
}

export interface IAcademicProgramTypeOption {
  label: string;
  value: string;
}

export const ACADEMIC_PROGRAM_TYPE_OPTIONS: IAcademicProgramTypeOption[] = [
  { label: 'Bachelors', value: 'BACHELORS' },
  { label: 'Masters', value: 'MASTERS' }
];

export interface ISubject {
  id: string;
  slug: string;
  name: string;
  code: string;
  semester: string;
  program: string;
  topics_covered: string;
  academic_program?: IAcademicProgramLite | null;
}

export interface ISubjectListResponse extends IListResponse {
  results: ISubject[];
}

export interface ISubjectFilters {
  limit: number;
  offset: number;
  search?: string;
  program?: string;
  academic_program_id?: string;
}

export interface ISubjectCreatePayload {
  name: string;
  code: string;
  semester: string;
  program: string;
  topics_covered: string;
  academic_program_id?: string | null;
}

export interface ISubjectUpdatePayload extends ISubjectCreatePayload {
  id: string;
}

export const PROGRAM_OPTIONS = [
  {
    label: 'BEI - Bachelor of Electronics, Information and Communication Engineering',
    value: 'Bachelor of Electronics, Information and Communication Engineering'
  },
  {
    label: 'BCT - Bachelor of Computer Engineering',
    value: 'Bachelor of Computer Engineering'
  },
  {
    label: 'BCE - Bachelor of Civil Engineering',
    value: 'Bachelor of Civil Engineering'
  },
  {
    label: 'BIE - Bachelor of Industrial Engineering',
    value: 'Bachelor of Industrial Engineering'
  },
  {
    label: 'BAM - Bachelor of AutoMobile Engineering',
    value: 'Bachelor of AutoMobile Engineering'
  },
  {
    label: 'BME - Bachelor of Mechanical Engineering',
    value: 'Bachelor of Mechanical Engineering'
  },
  {
    label: 'B.Arch - Bachelor of Architecture Engineering',
    value: 'Bachelor of Architecture Engineering'
  }
];

export const SEMESTER_OPTIONS = ['I/I', 'I/II', 'II/I', 'II/II', 'III/I', 'III/II', 'IV/I', 'IV/II', 'V/I', 'V/II'];
