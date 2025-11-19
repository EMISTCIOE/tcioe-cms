import { IListResponse } from '@/globals';

/* ------------------------- CampusDownloads slice interface ------------------------- */
export interface ICampusDownloadsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}
/* -------------------------- CampusDownloads get interfaces ------------------------- */

export interface ICampusDownloadsItem {
  id: string;
  title: string;
  file: string;
  description: string;
  isActive: boolean;
}

export interface ICampusDownloadsList extends IListResponse {
  results: ICampusDownloadsItem[];
}

export interface ICampusDownloadsDetails {
  id: string;
  title: string;
  file: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ CampusDownloads post interfaces ------------------------ */
export interface ICampusDownloadsCreatePayload {
  title: string;
  file: File | null;
  description?: string;
  isActive?: boolean;
}

/* ------------------------- CampusDownloads patch interfaces ------------------------- */
export interface ICampusDownloadsUpdatePayload {
  title: string;
  file?: File | string | null;
  description?: string;
  isActive?: boolean;
}
