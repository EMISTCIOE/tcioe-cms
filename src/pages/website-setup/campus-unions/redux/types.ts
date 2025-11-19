import { IListResponse } from '@/globals';

/* ------------------------- CampusUnions slice interface ------------------------- */
export interface ICampusUnionsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

/* -------------------------- CampusUnions get interfaces ------------------------- */

export interface ICampusUnionsItem {
  id: string;
  name: string;
  shortDescription: string;
  thumbnail?: string;
  isActive: boolean;
}

export interface ICampusUnionsMember {
  id: string;
  fullName: string;
  designation: string;
  photo?: string;
  isActive: boolean;
}

export interface ICampusUnionsList extends IListResponse {
  results: ICampusUnionsItem[];
}

export interface ICampusUnionsDetails {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  thumbnail: string;
  websiteUrl: string;
  members: ICampusUnionsMember[];
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ CampusUnions post interfaces ------------------------ */
export interface ICampusUnionsCreatePayload {
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  thumbnail?: File | null;
  websiteUrl?: string;
  members: (Omit<ICampusUnionsMember, 'id' | 'photo'> & { photo?: File | null })[];
  isActive: boolean;
}

/* ------------------------- CampusUnions patch interfaces ------------------------- */
export interface ICampusUnionsUpdatePayload {
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  thumbnail?: File | string | null;
  websiteUrl?: string;
  members?: (Omit<ICampusUnionsMember, 'id' | 'photo'> & { id?: string; photo?: File | string | null })[];
  isActive: boolean;
}
