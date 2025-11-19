import { IListResponse } from '@/globals';

/* ------------------------- CampusReports slice interface ------------------------- */
export interface ICampusReportsSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

/* ------------------------- CampusReports Enums ------------------------ */

export enum IReportType {
  SELF_STUDY = 'SELF_STUDY',
  ANNUAL = 'ANNUAL',
  OTHER = 'OTHER'
}

export interface IFiscalSession {
  id: string;
  sessionFull: string;
  sessionShort: string;
}

/* -------------------------- CampusReports get interfaces ------------------------- */

export interface ICampusReportsItem {
  id: string;
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
  id: string;
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
  fiscalSession: string;
  publishedDate?: Date | string;
  file?: File | null;
  isActive?: boolean;
}

/* ------------------------- CampusReports patch interfaces ------------------------- */
export interface ICampusReportsUpdatePayload {
  reportType: IReportType;
  fiscalSession: string;
  publishedDate?: Date | string;
  file?: File | string | null;
  isActive?: boolean;
}
