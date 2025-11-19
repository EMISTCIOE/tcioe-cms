import { IListResponse } from '@/globals';

/* ------------------------- CampusSections slice interface ------------------------- */
export interface ICampusSectionsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

/* -------------------------- CampusSections get interfaces ------------------------- */

export interface ICampusSectionsItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  thumbnail?: string | null;
  displayOrder: number;
  designations: string[];
  departmentHead?: string | null;
  departmentHeadDetail?: ICampusSectionOfficial | null;
  officials?: ICampusSectionOfficial[];
  isActive: boolean;
}

export interface ICampusSectionOfficial {
  id: string;
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
  id: string;
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
  members: string[];
  departmentHead?: string | null;
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
  members?: string[];
  departmentHead?: string | null;
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
  members?: string[];
  departmentHead?: string | null;
  isActive: boolean;
}
