import { IListResponse } from '@/globals';

/* ------------------------- Notice slice interface ------------------------- */
export interface INoticeSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

export enum NoticeStatus {
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
}

/* -------------------------- Notice get interfaces ------------------------- */
export interface INoticeCategoryItem {
  id: number;
  name: string;
}

export interface INoticeDepartmentItem {
  id: number;
  name: string;
}

export interface INoticeMediaItem {
  id: number;
  file: string;
  caption?: string;
  mediaType: MediaType;
}

export interface INoticeAuthorItem {
  id: number;
  fullName: string;
  photo: string;
}

export interface INoticeItem {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  isFeatured: boolean;
  department: number;
  category: number;
  status: NoticeStatus;
  departmentName: string;
  categoryName: string;
  authorName: string;
  publishedAt: string; // ISO Date string
}

export interface INoticeList extends IListResponse {
  results: INoticeItem[];
}

export interface INoticeDetails {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  isFeatured: boolean;
  department: INoticeDepartmentItem;
  category: INoticeCategoryItem;
  medias: INoticeMediaItem[];
  author: INoticeAuthorItem;
  createdBy: string;
  updatedBy: string;
  publishedAt: string; // ISO Date string
  createdAt: string;   // ISO Date string
  updatedAt: string;   // ISO Date string
  isActive: boolean;
}

/* ------------------------ Notice post interfaces ------------------------ */
export interface INoticeMediaCreatePayload {
  file: File | null;
  caption?: string;
  mediaType: MediaType;
}

export interface INoticeCreatePayload {
  title?: string;
  department: number;
  category: number;
  thumbnail?: File | null;
  isFeatured: boolean;
  isDraft: boolean;
  description?: string;
  medias?: INoticeMediaCreatePayload[];
}

/* ------------------------- Notice patch interfaces ------------------------- */
export interface INoticeMediaPatchPayload {
  id?: number;
  file: File | string | null;
  caption?: string;
  mediaType: MediaType
}

export interface INoticeUpdatePayload {
  title?: string;
  department?: number;
  category?: number;
  thumbnail?: File | string | null;
  isFeatured?: boolean;
  isDraft?: boolean;
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