import { IListResponse } from '@/globals';

/* ------------------------- CampusFeedbacks slice interface ------------------------- */
export interface ICampusFeedbacksSliceState {
  edit: boolean;
  currentId: number | null;
  viewId: number | null;
}

/* -------------------------- CampusFeedbacks get interfaces ------------------------- */

export interface ICampusFeedbacksItem {
  id: number;
  fullName: string;
  rollNumber: string;
  email: string;
  message: string;
  isResolved: boolean;
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
}
