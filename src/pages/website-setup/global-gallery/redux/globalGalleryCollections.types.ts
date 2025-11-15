import { IListResponse } from '@/globals';

export interface IGlobalGalleryCollectionImage {
  id: number;
  uuid: string;
  image: string;
  caption?: string | null;
  displayOrder: number;
}

export interface IGlobalGalleryCollectionReference {
  id: number;
  uuid: string;
  name: string;
}

export interface IGlobalGalleryCollection {
  id: number;
  uuid: string;
  title?: string | null;
  description?: string | null;
  isActive: boolean;
  campusEvent?: IGlobalGalleryCollectionReference | null;
  studentClubEvent?: IGlobalGalleryCollectionReference | null;
  departmentEvent?: IGlobalGalleryCollectionReference | null;
  union?: IGlobalGalleryCollectionReference | null;
  club?: IGlobalGalleryCollectionReference | null;
  department?: IGlobalGalleryCollectionReference | null;
  images: IGlobalGalleryCollectionImage[];
  createdAt: string;
}

export interface IGlobalGalleryCollectionList extends IListResponse {
  results: IGlobalGalleryCollection[];
}

export interface IGlobalGalleryCollectionCreateImagePayload {
  image: File;
  caption?: string;
  displayOrder?: number;
}

export interface IGlobalGalleryCollectionUpdateImagePayload {
  id?: number;
  image?: File | string;
  caption?: string;
  displayOrder?: number;
}

export interface IGlobalGalleryCollectionCreatePayload {
  title?: string;
  description?: string;
  campusEvent?: number | null;
  studentClubEvent?: number | null;
  departmentEvent?: number | null;
  union?: number | null;
  club?: number | null;
  department?: number | null;
  isActive?: boolean;
  images: IGlobalGalleryCollectionCreateImagePayload[];
}

export interface IGlobalGalleryCollectionUpdatePayload {
  title?: string;
  description?: string;
  campusEvent?: number | null;
  studentClubEvent?: number | null;
  departmentEvent?: number | null;
  union?: number | null;
  club?: number | null;
  department?: number | null;
  isActive?: boolean;
  images?: IGlobalGalleryCollectionUpdateImagePayload[];
}

export interface IGlobalGalleryCollectionsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}
