import { IListResponse } from '@/globals';

/* ------------------------- AcademicCalendars slice interface ------------------------- */
export interface IAcademicCalendarsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

/* ------------------------- AcademicCalendars Enums ------------------------ */

export enum IProgramType {
  BACHELORS = 'BACHELORS',
  MASTERS = 'MASTERS'
}

/* -------------------------- AcademicCalendars get interfaces ------------------------- */

export interface IAcademicCalendarsItem {
  id: string;
  programType: IProgramType;
  startYear: string; // ISO Date string
  endYear: string; // ISO Date string
  file: string;
  isActive: boolean;
}

export interface IAcademicCalendarsList extends IListResponse {
  results: IAcademicCalendarsItem[];
}

export interface IAcademicCalendarsDetails {
  id: string;
  programType: IProgramType;
  startYear: string; // ISO Date string
  endYear: string; // ISO Date string
  file: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ AcademicCalendars post interfaces ------------------------ */
export interface IAcademicCalendarsCreatePayload {
  programType: IProgramType;
  startYear: Date | string | number;
  endYear: Date | string | number;
  file?: File | null;
  isActive?: boolean;
}

/* ------------------------- AcademicCalendars patch interfaces ------------------------- */
export interface IAcademicCalendarsUpdatePayload {
  programType: IProgramType;
  startYear: Date | string | number;
  endYear: Date | string | number;
  file?: File | string | null;
  isActive?: boolean;
}
