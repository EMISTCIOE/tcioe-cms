import { IListResponse } from '@/globals';

/* ------------------------- StudentClubs slice interface ------------------------- */
export interface IStudentClubsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

/* -------------------------- StudentClubs get interfaces ------------------------- */

export interface IStudentClubsItem {
  id: string;
  name: string;
  shortDescription: string;
  thumbnail: string;
  isActive: boolean;
}

export interface IStudentClubsMember {
  id: string;
  fullName: string;
  designation: string;
  photo?: string;
  isActive: boolean;
}

export interface IStudentClubsList extends IListResponse {
  results: IStudentClubsItem[];
}

export interface IStudentClubsDetails {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  thumbnail: string;
  websiteUrl?: string;
  members: IStudentClubsMember[];
  department?: {
    id: string;
    uuid: string;
    name: string;
  } | null;
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
  department?: string | null;
  isActive: boolean;
}

/* ------------------------- StudentClubs patch interfaces ------------------------- */
export interface IStudentClubsUpdatePayload {
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  thumbnail?: File | string | null;
  websiteUrl?: string;
  members: (Omit<IStudentClubsMember, 'id' | 'photo'> & { id?: string; photo?: File | string | null })[];
  department?: string | null;
  isActive: boolean;
}
