import { IListResponse } from '@/globals';

/* ------------------------- CampusEvents slice interface ------------------------- */
export interface ICampusEventsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

export interface ICampusEventsStatusSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* ------------------------- CampusEvents Enums ------------------------ */

export enum ICampusEvent {
  CULTURAL = 'CULTURAL',
  TECHNICAL = 'TECHNICAL',
  MUSICAL = 'MUSICAL',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER'
}

/* -------------------------- CampusEvents get interfaces ------------------------- */

export interface ICampusEventsItem {
  id: number;
  title: string;
  eventType: ICampusEvent;
  eventStartDate: string; // ISO Date string
  eventEndDate: string; // ISO Date string
  thumbnail: string;
  isActive: boolean;
}

export interface ICampusEventsGallery {
  id: number;
  image: string;
  caption?: string;
  isActive?: boolean;
}

export interface ICampusEventsList extends IListResponse {
  results: ICampusEventsItem[];
}

export interface ICampusEventsDetails {
  id: number;
  title: string;
  descriptionShort: string;
  descriptionDetailed: string;
  eventType: ICampusEvent;
  eventStartDate: string; // ISO Date string
  eventEndDate: string; // ISO Date string
  thumbnail: string;
  gallery: ICampusEventsGallery[];
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ CampusEvents post interfaces ------------------------ */
export interface ICampusEventsCreatePayload {
  title: string;
  descriptionShort: string;
  descriptionDetailed?: string;
  eventType?: ICampusEvent;
  eventStartDate?: string; // ISO Date string
  eventEndDate?: string; // ISO Date string
  thumbnail: File | null;
  gallery?: (Omit<ICampusEventsGallery, 'id' | 'image'> & { image: File | null })[];
  isActive?: boolean;
}

/* ------------------------- CampusEvents patch interfaces ------------------------- */
export interface ICampusEventsUpdatePayload {
  title: string;
  descriptionShort: string;
  descriptionDetailed?: string;
  eventType?: ICampusEvent;
  eventStartDate?: string; // ISO Date string
  eventEndDate?: string; // ISO Date string
  thumbnail?: File | string | null;
  gallery?: (Omit<ICampusEventsGallery, 'id' | 'image'> & { id?: number; image: File | string })[];
  isActive?: boolean;
}
