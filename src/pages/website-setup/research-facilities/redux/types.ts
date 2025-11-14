import { IListResponse } from '@/globals';

/* ------------------------- ResearchFacilities slice interface ------------------------- */
export interface IResearchFacilitiesSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* -------------------------- ResearchFacilities get interfaces ------------------------- */

export interface IResearchFacilityItem {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  shortDescription: string;
  thumbnail?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface IResearchFacilitiesList extends IListResponse {
  results: IResearchFacilityItem[];
}

export interface IResearchFacilityDetails extends IResearchFacilityItem {
  description?: string;
  objectives?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------ ResearchFacilities post interfaces ------------------------ */
export interface IResearchFacilityCreatePayload {
  name: string;
  slug?: string;
  shortDescription: string;
  description?: string;
  objectives?: string;
  thumbnail?: File | null;
  displayOrder?: number;
  isActive: boolean;
}

/* ------------------------- ResearchFacilities patch interfaces ------------------------- */
export interface IResearchFacilityUpdatePayload {
  name: string;
  slug?: string;
  shortDescription: string;
  description?: string;
  objectives?: string;
  thumbnail?: File | string | null;
  displayOrder?: number;
  isActive: boolean;
}
