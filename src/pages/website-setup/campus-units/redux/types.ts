import { IListResponse } from '@/globals';

/* ------------------------- CampusUnits slice interface ------------------------- */
export interface ICampusUnitsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* -------------------------- CampusUnits get interfaces ------------------------- */

export interface ICampusUnitsItem {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  thumbnail?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ICampusUnitsMember {
  id: number;
  titlePrefix?: string | null;
  fullName: string;
  designation: string;
  email?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  photo?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ICampusUnitsList extends IListResponse {
  results: ICampusUnitsItem[];
}

export interface ICampusUnitsDetails {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  detailedDescription?: string;
  objectives?: string;
  achievements?: string;
  thumbnail?: string | null;
  heroImage?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  displayOrder: number;
  members: ICampusUnitsMember[];
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ CampusUnits post interfaces ------------------------ */
export interface ICampusUnitsCreatePayload {
  name: string;
  slug?: string;
  shortDescription: string;
  detailedDescription?: string;
  objectives?: string;
  achievements?: string;
  thumbnail?: File | null;
  heroImage?: File | null;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  displayOrder?: number;
  members?: (Omit<ICampusUnitsMember, 'id' | 'photo'> & { photo?: File | null })[];
  isActive: boolean;
}

/* ------------------------- CampusUnits patch interfaces ------------------------- */
export interface ICampusUnitsUpdatePayload {
  name: string;
  slug?: string;
  shortDescription: string;
  detailedDescription?: string;
  objectives?: string;
  achievements?: string;
  thumbnail?: File | string | null;
  heroImage?: File | string | null;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  displayOrder?: number;
  members?: (Omit<ICampusUnitsMember, 'id' | 'photo'> & { id?: number; photo?: File | string | null })[];
  isActive: boolean;
}
