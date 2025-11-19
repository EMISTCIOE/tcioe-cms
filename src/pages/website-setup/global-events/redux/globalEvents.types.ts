import { IListResponse } from '@/globals';
import { ICampusEvent } from '@/pages/website-setup/campus-events/redux/types';

export interface IGlobalEventReference {
  id: string;
  uuid: string;
  name: string;
}

export interface IGlobalEvent {
  id: string;
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
  isApprovedByDepartment?: boolean;
  isApprovedByCampus?: boolean;
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
  unions?: string[];
  clubs?: string[];
  departments?: string[];
}

export interface IGlobalEventsUpdatePayload {
  title?: string;
  description?: string;
  eventType?: ICampusEvent;
  eventStartDate?: string;
  eventEndDate?: string;
  thumbnail?: File | string | null;
  registrationLink?: string;
  location?: string;
  isActive?: boolean;
  isApprovedByDepartment?: boolean;
  isApprovedByCampus?: boolean;
  unions?: string[];
  clubs?: string[];
  departments?: string[];
}

export interface IGlobalEventsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}
