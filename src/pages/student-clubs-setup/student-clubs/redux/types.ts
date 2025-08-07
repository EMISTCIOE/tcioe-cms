import { IListResponse } from '@/globals';

/* ------------------------- StudentClubs slice interface ------------------------- */
export interface IStudentClubsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* -------------------------- StudentClubs get interfaces ------------------------- */

export interface IStudentClubsItem {
  id: number;
  name: string;
  shortDescription: string;
  thumbnail: string;
  isActive: boolean;
}

export interface IStudentClubsMember {
  id: number;
  fullName: string;
  designation: string;
  photo?: string;
  isActive: boolean;
}

export interface IStudentClubsList extends IListResponse {
  results: IStudentClubsItem[];
}

export interface IStudentClubsDetails {
  id: number;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  thumbnail: string;
  websiteUrl?: string;
  members: IStudentClubsMember[];
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ StudentClubs post interfaces ------------------------ */
export interface IStudentClubsCreatePayload {
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  thumbnail?: File | null;
  websiteUrl?: string;
  members: (Omit<IStudentClubsMember, 'id' | 'photo'> & { photo?: File | null })[];
  isActive: boolean;
}

/* ------------------------- StudentClubs patch interfaces ------------------------- */
export interface IStudentClubsUpdatePayload {
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  thumbnail?: File | string | null;
  websiteUrl?: string;
  members: (Omit<IStudentClubsMember, 'id' | 'photo'> & { id?: number; photo?: File | string | null })[];
  isActive: boolean;
}
