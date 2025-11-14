import { IListResponse } from '@/globals';

/* ------------------------- CampusKeyOfficials slice interface ------------------------- */
export interface ICampusKeyOfficialsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

export interface ICampusKeyOfficialsStatusSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* ------------------------- CampuskeyOfficials Enums ------------------------ */

export enum CampusKeyOfficialsTitleprefix {
  ER = 'ER',
  PROF = 'PROF',
  DR = 'DR',
  MR = 'MR',
  MRS = 'MRS',
  MS = 'MS',
  ASSOC_PROF = 'ASSOC_PROF',
  ASST_PROF = 'ASST_PROF',
  LECTURER = 'LECTURER',
  TECHNICIAN = 'TECHNICIAN',
  OTHER = 'OTHER'
}

export enum CampusKeyOfficialsDesignation {
  CAMPUS_CHIEF = 'CAMPUS_CHIEF',
  ASSIST_CAMPUS_CHIEF_ADMIN = 'ASSIST_CAMPUS_CHIEF_ADMIN',
  ASSIST_CAMPUS_CHIEF_ACADEMIC = 'ASSIST_CAMPUS_CHIEF_ACADEMIC',
  ASSIST_CAMPUS_CHIEF_PLANNING = 'ASSIST_CAMPUS_CHIEF_PLANNING',
  MSC_COORD_INFORMATION = 'MSC_COORD_INFORMATION',
  MSC_COORD_EARTHQUAKE = 'MSC_COORD_EARTHQUAKE',
  MSC_COORD_DESIGN = 'MSC_COORD_DESIGN',
  MSC_COORD_MSEQE = 'MSC_COORD_MSEQE',
  MSC_COORD_MSIS = 'MSC_COORD_MSIS',
  MSC_COORD_MSEDM = 'MSC_COORD_MSEDM',
  EMIS_HEAD = 'EMIS_HEAD',
  RESEARCH_HEAD = 'RESEARCH_HEAD',
  CONSULTANCY_HEAD = 'CONSULTANCY_HEAD',
  EXAMS_ACADEMIC_HEAD = 'EXAMS_ACADEMIC_HEAD',
  LIBRARY_HEAD = 'LIBRARY_HEAD',
  FINANCE_HEAD = 'FINANCE_HEAD',
  PERSONNEL_HEAD = 'PERSONNEL_HEAD',
  PLANNING_HEAD = 'PLANNING_HEAD',
  PROCUREMENT_HEAD = 'PROCUREMENT_HEAD',
  SECURITY_HEAD = 'SECURITY_HEAD',
  IQAC_HEAD = 'IQAC_HEAD',
  ADMINISTRATION_HEAD = 'ADMINISTRATION_HEAD',
  FACILITIES_HEAD = 'FACILITIES_HEAD',
  HEAD_OF_INDUSTRIAL_DEPARTMENT = 'HEAD_OF_INDUSTRIAL_DEPARTMENT',
  HEAD_OF_ARCHITECTURE_DEPARTMENT = 'HEAD_OF_ARCHITECTURE_DEPARTMENT',
  HEAD_OF_APPLIED_SCIENCE_DEPARTMENT = 'HEAD_OF_APPLIED_SCIENCE_DEPARTMENT',
  HEAD_OF_AUTOMOBILE_AND_MECHANICAL_DEPARTMENT = 'HEAD_OF_AUTOMOBILE_AND_MECHANICAL_DEPARTMENT',
  HEAD_OF_ELECTRONICS_AND_COMPUTER_DEPARTMENT = 'HEAD_OF_ELECTRONICS_AND_COMPUTER_DEPARTMENT',
  HEAD_OF_MATERIAL_TESTING_LAB = 'HEAD_OF_MATERIAL_TESTING_LAB',
  HEAD_OF_STORE_SECTION = 'HEAD_OF_STORE_SECTION',
  HEAD_OF_FINANCE_ADMINISTRATION_SECTION = 'HEAD_OF_FINANCE_ADMINISTRATION_SECTION',
  HEAD_OF_EMIS_UNIT = 'HEAD_OF_EMIS_UNIT',
  HEAD_OF_SAT = 'HEAD_OF_SAT',
  DEPUTY_FINANCE_CONTROLLER = 'DEPUTY_FINANCE_CONTROLLER',
  LIBRARIAN = 'LIBRARIAN',
  ACCOUNT_OFFICER = 'ACCOUNT_OFFICER'
}

/* -------------------------- CampusKeyOfficials get interfaces ------------------------- */

export interface ICampusKeyOfficialsItem {
  id: number;
  titlePrefix: CampusKeyOfficialsTitleprefix;
  designation: CampusKeyOfficialsDesignation;
  fullName: string;
  photo: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface ICampusKeyOfficialsList extends IListResponse {
  results: ICampusKeyOfficialsItem[];
}

export interface ICampusKeyOfficialsDetails {
  id: number;
  titlePrefix: CampusKeyOfficialsTitleprefix;
  designation: CampusKeyOfficialsDesignation;
  fullName: string;
  message: string;
  photo: string;
  email: string;
  phoneNumber: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ CampusKeyOfficials post interfaces ------------------------ */
export interface ICampusKeyOfficialsCreatePayload {
  titlePrefix: CampusKeyOfficialsTitleprefix;
  designation: CampusKeyOfficialsDesignation;
  fullName: string;
  photo: File | null;
  email?: string;
  phoneNumber?: string;
  message?: string;
  isActive?: boolean;
}

/* ------------------------- CampusKeyOfficials patch interfaces ------------------------- */
export interface ICampusKeyOfficialsUpdatePayload {
  titlePrefix?: CampusKeyOfficialsTitleprefix;
  designation?: CampusKeyOfficialsDesignation;
  fullName?: string;
  photo?: File | string | null;
  email?: string;
  phoneNumber?: string;
  message?: string;
  isActive?: boolean;
}
