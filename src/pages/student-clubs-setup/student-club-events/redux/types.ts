import { IListResponse } from '@/globals';

/* ------------------------- StudentClubEvents slice interface ------------------------- */
export interface IStudentClubEventsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* -------------------------- StudentClubEvents get interfaces ------------------------- */
export interface IClub {
  id: number;
  name: string;
}

export interface IStudentClubEventsItem {
  id: number;
  title: string;
  date: string; // ISO Date string
  thumbnail: string;
  club: IClub;
  isActive: boolean;
}

export interface IStudentClubEventsGallery {
  id: number;
  image: string;
  caption?: string;
  isActive?: boolean;
}

export interface IStudentClubEventsList extends IListResponse {
  results: IStudentClubEventsItem[];
}

export interface IStudentClubEventsDetails {
  id: number;
  title: string;
  description: string;
  date: string; // ISO Date string
  thumbnail: string;
  club: IClub;
  gallery: IStudentClubEventsGallery[];
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ StudentClubEvents post interfaces ------------------------ */
export interface IStudentClubEventsCreatePayload {
  title: string;
  description?: string;
  date?: string; // ISO Date string
  thumbnail: File | null;
  club: number; // Club ID
  gallery?: (Omit<IStudentClubEventsGallery, 'id' | 'image'> & { image: File | null })[];
  isActive?: boolean;
}

/* ------------------------- StudentClubEvents patch interfaces ------------------------- */
export interface IStudentClubEventsUpdatePayload {
  title?: string;
  description?: string;
  date?: string; // ISO Date string
  club: number; // Club ID
  thumbnail?: File | string | null;
  gallery?: (Omit<IStudentClubEventsGallery, 'id' | 'image'> & { id?: number; image: File | string })[];
  isActive?: boolean;
}
