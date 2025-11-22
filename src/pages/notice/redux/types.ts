import { IListResponse } from '@/globals';

/* ------------------------- Notice slice interface ------------------------- */
export interface INoticeSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

export interface INoticeStatusSliceState {
  isApproved: boolean;
  currentId: string | null;
}

export enum NoticeStatus {
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT'
}

/* -------------------------- Notice get interfaces ------------------------- */
export interface INoticeCategoryItem {
  id: string;
  name: string;
}

export interface INoticeDepartmentItem {
  id: string;
  name: string;
}

export interface INoticeMediaItem {
  id: string;
  file: string;
  caption?: string;
  mediaType: MediaType;
}

export interface INoticeAuthorItem {
  id: string;
  fullName: string;
  photo: string;
}

export interface INoticeItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  isFeatured: boolean;
  isApprovedByDepartment?: boolean;
  isApprovedByCampus?: boolean;
  department: string | null;
  category: string;
  status: NoticeStatus;
  departmentName: string | null;
  categoryName: string;
  authorName: string;
  publishedAt: string; // ISO Date string
}

export interface INoticeList extends IListResponse {
  results: INoticeItem[];
}

export interface INoticeDetails {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  isFeatured: boolean;
  isApprovedByDepartment?: boolean;
  isApprovedByCampus?: boolean;
  department: INoticeDepartmentItem | null;
  category: INoticeCategoryItem;
  medias: INoticeMediaItem[] | null;
  author: INoticeAuthorItem;
  status: NoticeStatus;
  createdBy: string;
  updatedBy: string;
  publishedAt: string; // ISO Date string
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isActive: boolean;
}

/* ------------------------ Notice post interfaces ------------------------ */
export interface INoticeMediaCreatePayload {
  file: File | null;
  caption?: string;
  mediaType: MediaType;
}

export interface INoticeCreatePayload {
  title: string;
  department: string | null;
  campusUnit?: string | null;
  campusSection?: string | null;
  category: string;
  thumbnail?: File | null;
  isFeatured: boolean;
  isDraft: boolean;
  description?: string;
  medias?: INoticeMediaCreatePayload[];
  // Optional approvals that may be set during creation
  isApprovedByDepartment?: boolean;
  isApprovedByCampus?: boolean;
}

/* ------------------------- Notice patch interfaces ------------------------- */
export interface INoticeMediaPatchPayload {
  id?: string;
  file: File | string | null;
  caption?: string;
  mediaType: MediaType;
}

export interface INoticeUpdatePayload {
  title: string;
  department?: string | null;
  campusUnit?: string | null;
  campusSection?: string | null;
  category?: string;
  thumbnail?: File | string | null;
  isFeatured?: boolean;
  isDraft?: boolean;
  status?: NoticeStatus;
  isApprovedByDepartment?: boolean;
  isApprovedByCampus?: boolean;
  description?: string;
  medias?: INoticeMediaPatchPayload[];
}

/* ------------------------ other listing interfaces ------------------------ */
export interface INoticeAuthorListResponse extends IListResponse {
  results: INoticeAuthorItem[];
}

export interface INoticeCategoryListResponse extends IListResponse {
  results: INoticeCategoryItem[];
}

export interface INoticeDepartmentListResponse extends IListResponse {
  results: INoticeDepartmentItem[];
}
