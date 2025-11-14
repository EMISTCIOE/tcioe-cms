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
  designations: string[];
  departmentHead?: number | null;
  departmentHeadDetail?: ICampusSectionOfficial | null;
  officials?: ICampusSectionOfficial[];
  isActive: boolean;
}

export interface ICampusSectionOfficial {
  id: number;
  uuid: string;
  titlePrefix?: string | null;
  titlePrefixDisplay?: string | null;
  fullName: string;
  designation: string;
  designationDisplay?: string;
  photo?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  isKeyOfficial?: boolean;
  isActive?: boolean;
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
  designations: string[];
  officials: ICampusSectionOfficial[];
  members: number[];
  departmentHead?: number | null;
  departmentHeadDetail?: ICampusSectionOfficial | null;
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
  designations?: string[];
  members?: number[];
  departmentHead?: number | null;
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
  designations?: string[];
  members?: number[];
  departmentHead?: number | null;
  isActive: boolean;
}
