import { IListResponse } from '@/globals';

export interface IGlobalGalleryItem {
  uuid: string;
  image: string;
  caption?: string | null;
  sourceType: string;
  sourceName: string;
  sourceContext?: string | null;
  sourceIdentifier: string;
  createdAt: string;
}

export interface IGlobalGalleryListResponse extends IListResponse {
  results: IGlobalGalleryItem[];
}
