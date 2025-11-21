import { IListResponse } from '@/globals';

/* ------------------------- AcademicDownloads slice interface ------------------------- */
export interface IAcademicDownloadsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

export interface IDepartmentInfo {
  id: string;
  name: string;
  short_name?: string;
  thumbnail?: string | null;
}

/* -------------------------- AcademicDownloads get interfaces ------------------------- */

export interface IAcademicDownloadsItem {
  id: string;
  title: string;
  file: string;
  description: string;
  department: IDepartmentInfo | null;
  isActive: boolean;
}

export interface IAcademicDownloadsList extends IListResponse {
  results: IAcademicDownloadsItem[];
}

export interface IAcademicDownloadsDetails {
  id: string;
  title: string;
  file: string;
  description: string;
  department: IDepartmentInfo | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ AcademicDownloads post interfaces ------------------------ */
export interface IAcademicDownloadsCreatePayload {
  title: string;
  department: string;
  file: File | null;
  description?: string;
  isActive?: boolean;
}

/* ------------------------- AcademicDownloads patch interfaces ------------------------- */
export interface IAcademicDownloadsUpdatePayload {
  title?: string;
  department?: string;
  file?: File | string | null;
  description?: string;
  isActive?: boolean;
}
