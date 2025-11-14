import { IListResponse } from '@/globals';

/* ------------------------- CampusSections slice interface ------------------------- */
export interface ICampusSectionsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* -------------------------- CampusSections get interfaces ------------------------- */

export interface ICampusSectionsItem {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  thumbnail?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ICampusSectionsMember {
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

export interface ICampusSectionsList extends IListResponse {
  results: ICampusSectionsItem[];
}

export interface ICampusSectionsDetails {
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
  members: ICampusSectionsMember[];
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ CampusSections post interfaces ------------------------ */
export interface ICampusSectionsCreatePayload {
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
  members?: (Omit<ICampusSectionsMember, 'id' | 'photo'> & { photo?: File | null })[];
  isActive: boolean;
}

/* ------------------------- CampusSections patch interfaces ------------------------- */
export interface ICampusSectionsUpdatePayload {
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
  members?: (Omit<ICampusSectionsMember, 'id' | 'photo'> & { id?: number; photo?: File | string | null })[];
  isActive: boolean;
}
