import { IListResponse } from '@/globals';
import { ICampusEvent } from '@/pages/website-setup/campus-events/redux/types';

export interface IGlobalEventReference {
  id: number;
  uuid: string;
  name: string;
}

export interface IGlobalEvent {
  id: number;
  uuid: string;
  title: string;
  description?: string | null;
  eventType?: ICampusEvent | null;
  eventStartDate: string;
  eventEndDate?: string | null;
  thumbnail?: string | null;
  registrationLink?: string | null;
  location?: string | null;
  isActive: boolean;
}

export interface IGlobalEventsList extends IListResponse {
  results: IGlobalEvent[];
}

export interface IGlobalEventsDetails extends IGlobalEvent {
  unions: IGlobalEventReference[];
  clubs: IGlobalEventReference[];
  departments: IGlobalEventReference[];
  createdAt: string;
  updatedAt: string;
}

export interface IGlobalEventsCreatePayload {
  title: string;
  description?: string;
  eventType?: ICampusEvent;
  eventStartDate?: string;
  eventEndDate?: string;
  thumbnail?: File | null;
  registrationLink?: string;
  location?: string;
  isActive?: boolean;
  unions?: number[];
  clubs?: number[];
  departments?: number[];
}

export interface IGlobalEventsUpdatePayload {
  title: string;
  description?: string;
  eventType?: ICampusEvent;
  eventStartDate?: string;
  eventEndDate?: string;
  thumbnail?: File | string | null;
  registrationLink?: string;
  location?: string;
  isActive?: boolean;
  unions?: number[];
  clubs?: number[];
  departments?: number[];
}

export interface IGlobalEventsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}
