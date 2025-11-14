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

export interface ICampusStaffDesignation {
  id: number;
  code: string;
  title: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ICampusStaffDesignationList extends IListResponse {
  results: ICampusStaffDesignation[];
}

/* -------------------------- CampusKeyOfficials get interfaces ------------------------- */

export interface ICampusKeyOfficialsItem {
  id: number;
  titlePrefix: CampusKeyOfficialsTitleprefix;
  titlePrefixDisplay?: string | null;
  designation: string;
  designationDisplay?: string | null;
  fullName: string;
  photo?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  isKeyOfficial: boolean;
  isActive: boolean;
}

export interface ICampusKeyOfficialsList extends IListResponse {
  results: ICampusKeyOfficialsItem[];
}

export interface ICampusKeyOfficialsDetails {
  id: number;
  titlePrefix: CampusKeyOfficialsTitleprefix;
  designation: string;
  designationDisplay?: string | null;
  fullName: string;
  message: string;
  photo: string | null;
  email: string | null;
  phoneNumber: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isKeyOfficial: boolean;
  isActive: boolean;
}

/* ------------------------ CampusKeyOfficials post interfaces ------------------------ */
export interface ICampusKeyOfficialsCreatePayload {
  titlePrefix: CampusKeyOfficialsTitleprefix;
  designation: string;
  fullName: string;
  photo: File | null;
  email?: string;
  phoneNumber?: string;
  message?: string;
  isKeyOfficial?: boolean;
  isActive?: boolean;
}

/* ------------------------- CampusKeyOfficials patch interfaces ------------------------- */
export interface ICampusKeyOfficialsUpdatePayload {
  titlePrefix?: CampusKeyOfficialsTitleprefix;
  designation?: string;
  fullName?: string;
  photo?: File | string | null;
  email?: string;
  phoneNumber?: string;
  message?: string;
  isKeyOfficial?: boolean;
  isActive?: boolean;
}
