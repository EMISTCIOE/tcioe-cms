import { IListResponse } from '@/globals';

/* ------------------------- StudentClubEvents slice interface ------------------------- */
export interface IStudentClubEventsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

/* -------------------------- StudentClubEvents get interfaces ------------------------- */
export interface IClub {
  id: string;
  name: string;
}

export interface IStudentClubEventsItem {
  id: string;
  title: string;
  date: string; // ISO Date string
  thumbnail: string;
  club: IClub;
  isActive: boolean;
}

export interface IStudentClubEventsGallery {
  id: string;
  image: string;
  caption?: string;
  isActive?: boolean;
}

export interface IStudentClubEventsList extends IListResponse {
  results: IStudentClubEventsItem[];
}

export interface IStudentClubEventsDetails {
  id: string;
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
  club: string; // Club ID
  gallery?: (Omit<IStudentClubEventsGallery, 'id' | 'image'> & { id?: string; image: File | null })[];
  isActive?: boolean;
}

/* ------------------------- StudentClubEvents patch interfaces ------------------------- */
export interface IStudentClubEventsUpdatePayload {
  title?: string;
  description?: string;
  date?: string; // ISO Date string
  club: string; // Club ID
  thumbnail?: File | string | null;
  gallery?: (Omit<IStudentClubEventsGallery, 'id' | 'image'> & { id?: string; image: File | string })[];
  isActive?: boolean;
}
