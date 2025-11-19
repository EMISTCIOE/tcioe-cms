export type HardwareTypeOption = 'router' | 'switch' | 'server' | 'firewall' | 'endpoint' | 'other';

export interface IEmisHardware {
  id: string;
  name: string;
  hardware_type: HardwareTypeOption;
  ip_address?: string;
  location?: string;
  description?: string;
  endpoints?: Record<string, unknown> | null;
}

export interface IEmisVpsInfo {
  id: string;
  vps_label: string;
  ip_address?: string;
  description?: string;
  notes?: string;
  affiliated_ports?: Record<string, unknown>[] | null;
}

export interface IEmailResetRequest {
  id: string;
  full_name: string;
  roll_number: string;
  birth_date: string;
  primary_email: string;
  secondary_email: string;
  request_sequence: number;
  requests_remaining: number;
  created_at: string;
}

export interface IEmisHardwareCreatePayload {
  name: string;
  hardware_type: HardwareTypeOption;
  ip_address?: string;
  location?: string;
  description?: string;
}

export interface IEmisVpsInfoCreatePayload {
  vps_label: string;
  ip_address: string;
  description?: string;
  notes?: string;
}

export interface IEmailResetRequestCreatePayload {
  full_name: string;
  roll_number: string;
  birth_date: string;
  primary_email: string;
  secondary_email: string;
}

