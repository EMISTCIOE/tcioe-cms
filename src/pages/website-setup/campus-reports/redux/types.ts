import { IListResponse } from '@/globals';

/* ------------------------- CampusReports slice interface ------------------------- */
export interface ICampusReportsSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* ------------------------- CampusReports Enums ------------------------ */

export enum IReportType {
  SELF_STUDY = 'SELF_STUDY',
  ANNUAL = 'ANNUAL',
  OTHER = 'OTHER'
}

export interface IFiscalSession {
  id: number;
  sessionFull: string;
  sessionShort: string;
}

/* -------------------------- CampusReports get interfaces ------------------------- */

export interface ICampusReportsItem {
  id: number;
  reportType: IReportType;
  fiscalSession: IFiscalSession;
  publishedDate: string; // ISO Date string
  file: string;
  isActive: boolean;
}

export interface ICampusReportsList extends IListResponse {
  results: ICampusReportsItem[];
}
export interface IFiscalSessionsList extends IListResponse {
  results: IFiscalSession[];
}

export interface ICampusReportsDetails {
  id: number;
  reportType: IReportType;
  fiscalSession: IFiscalSession;
  publishedDate: string; // ISO Date string
  file: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ CampusReports post interfaces ------------------------ */
export interface ICampusReportsCreatePayload {
  reportType: IReportType;
  fiscalSession: number;
  publishedDate?: Date | string;
  file?: File | null;
  isActive?: boolean;
}

/* ------------------------- CampusReports patch interfaces ------------------------- */
export interface ICampusReportsUpdatePayload {
  reportType: IReportType;
  fiscalSession: number;
  publishedDate?: Date | string;
  file?: File | string | null;
  isActive?: boolean;
}
