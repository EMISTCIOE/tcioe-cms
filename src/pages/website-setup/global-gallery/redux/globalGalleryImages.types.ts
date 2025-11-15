import { IListResponse } from '@/globals';

export interface IGlobalGalleryImage {
  id: number;
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
  union?: number | null;
  club?: number | null;
  department?: number | null;
  globalEvent?: number | null;
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
  union?: number | null;
  club?: number | null;
  department?: number | null;
  globalEvent?: number | null;
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
  union?: number | null;
  club?: number | null;
  department?: number | null;
  globalEvent?: number | null;
  image?: File;
}

export interface IGlobalGalleryImagesSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}
