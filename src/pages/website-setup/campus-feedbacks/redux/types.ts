import { IListResponse } from '@/globals';

/* ------------------------- CampusFeedbacks slice interface ------------------------- */
export interface ICampusFeedbacksSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}

/* -------------------------- CampusFeedbacks get interfaces ------------------------- */

export interface ICampusFeedbacksItem {
  id: string;
  fullName: string;
  rollNumber: string;
  email: string;
  message: string;
  isResolved: boolean;
  responseMessage?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string; // ISO Date string
}

export interface ICampusFeedbacksList extends IListResponse {
  results: ICampusFeedbacksItem[];
}

// both are same
export interface ICampusFeedbacksDetails extends ICampusFeedbacksItem {}

/* ------------------------- CampusFeedbacks patch interfaces ------------------------- */

export interface ICampusFeedbacksUpdatePayload {
  isResolved: boolean;
  responseMessage?: string;
}
