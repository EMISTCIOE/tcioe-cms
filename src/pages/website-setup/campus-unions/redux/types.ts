import { IListResponse } from '@/globals';

/* ------------------------- CampusUnions slice interface ------------------------- */
export interface ICampusUnionsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* -------------------------- CampusUnions get interfaces ------------------------- */

export interface ICampusUnionsItem {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ICampusUnionsMember {
  id: number;
  fullName: string;
  designation: string;
  photo?: string;
  isActive: boolean;
}

export interface ICampusUnionsList extends IListResponse {
  results: ICampusUnionsItem[];
}

export interface ICampusUnionsDetails {
  id: number;
  name: string;
  description: string;
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
  description?: string;
  members: (Omit<ICampusUnionsMember, 'id' | 'photo'> & { photo?: File | null })[];
  isActive: boolean;
}

/* ------------------------- CampusUnions patch interfaces ------------------------- */
export interface ICampusUnionsUpdatePayload {
  name: string;
  description?: string;
  members?: (Omit<ICampusUnionsMember, 'id' | 'photo'> & { id?: number; photo?: File | string | null })[];
  isActive: boolean;
}
