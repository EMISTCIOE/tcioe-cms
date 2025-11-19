import { IListResponse } from '@/globals';

export interface IGlobalGalleryImage {
  id: string;
  uuid: string;
  image: string;
  caption?: string | null;
  displayOrder: number;
  isActive: boolean;
  sourceType: string;
  sourceIdentifier: string;
  sourceName: string;
  sourceContext?: string | null;
  sourceTitle?: string | null;
  union?: string | null;
  club?: string | null;
  department?: string | null;
  unit?: string | null;
  section?: string | null;
  globalEvent?: string | null;
  createdAt: string;
}

export interface IGlobalGalleryImageList extends IListResponse {
  results: IGlobalGalleryImage[];
}

export interface IGlobalGalleryImageUploadPayload {
  image: File;
  caption?: string;
  displayOrder?: number;
}

export interface IGlobalGalleryImageCreatePayload {
  union?: string | null;
  club?: string | null;
  department?: string | null;
  unit?: string | null;
  section?: string | null;
  globalEvent?: string | null;
  sourceTitle?: string;
  sourceContext?: string;
  isActive?: boolean;
  images: IGlobalGalleryImageUploadPayload[];
}

export interface IGlobalGalleryImageUpdatePayload {
  caption?: string;
  displayOrder?: number;
  isActive?: boolean;
  sourceTitle?: string;
  sourceContext?: string;
  union?: string | null;
  club?: string | null;
  department?: string | null;
  unit?: string | null;
  section?: string | null;
  globalEvent?: string | null;
  image?: File;
}

export interface IGlobalGalleryImagesSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}
