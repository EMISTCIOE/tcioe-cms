export interface IPhoneNumber {
  id: string;
  department_name: string;
  phone_number: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export interface IPhoneNumberList {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPhoneNumber[];
}

export interface IPhoneNumberCreatePayload {
  department_name: string;
  phone_number: string;
  description?: string;
  display_order: number;
}

export interface IPhoneNumberUpdatePayload {
  department_name?: string;
  phone_number?: string;
  description?: string;
  display_order?: number;
  is_active?: boolean;
}
