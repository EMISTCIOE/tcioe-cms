export interface IDepartment {
  id: string;
  name: string;
  short_name: string;
  slug?: string;
  brief_description?: string;
  detailed_description?: string;
  phone_no?: string;
  email?: string;
  thumbnail: string | null;
  is_active: boolean;
}

export interface IDepartmentList {
  count: number;
  next: string | null;
  previous: string | null;
  results: IDepartment[];
}

export interface IDepartmentCreatePayload {
  name: string;
  short_name?: string;
  brief_description?: string;
  detailed_description?: string;
  phone_no?: string;
  email?: string;
  thumbnail?: File | null;
  is_active?: boolean;
}

export interface IDepartmentUpdatePayload {
  name?: string;
  short_name?: string;
  brief_description?: string;
  detailed_description?: string;
  phone_no?: string;
  email?: string;
  thumbnail?: File | null;
  is_active?: boolean;
}

export interface IDepartmentSliceState {
  edit: boolean;
  currentId: string | null;
  viewId: string | null;
}
