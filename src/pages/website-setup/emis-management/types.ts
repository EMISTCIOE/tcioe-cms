export type HardwareTypeOption = 'router' | 'switch' | 'server' | 'firewall' | 'endpoint' | 'other';
export type RequestStatusType = 'pending' | 'approved' | 'rejected';

export interface IEmisHardware {
  id: string;
  name: string;
  hardware_type: HardwareTypeOption;
  ip_address?: string;
  location?: string;
  thumbnail_image?: string;
  description?: string;
  specifications?: Record<string, unknown>;
  endpoints?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface IEmisVpsInfo {
  id: string;
  vps_name: string;
  ip_address: string;
  ram_gb: number;
  cpu_cores: number;
  storage_gb?: number;
  description?: string;
  notes?: string;
  services?: IEmisVpsService[];
  services_count?: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface IEmisVpsService {
  id: string;
  vps: string;
  name: string;
  port: number;
  service_type: string;
  domain: string;
  is_ssl_enabled: boolean;
  description?: string;
  url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface IEmailResetRequest {
  id: string;
  full_name: string;
  roll_number: string;
  birth_date: string;
  primary_email: string;
  secondary_email: string;
  phone_number: string;
  status: RequestStatusType;
  request_sequence: number;
  requests_remaining: number;
  processed_at?: string;
  processed_by?: string;
  processed_by_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface IEmisHardwareCreatePayload {
  name: string;
  hardware_type: HardwareTypeOption;
  ip_address?: string;
  location?: string;
  thumbnail_image?: File | null;
  specifications?: Record<string, unknown>;
  description?: string;
}

export interface IEmisVpsInfoCreatePayload {
  vps_name: string;
  ip_address: string;
  ram_gb: number;
  cpu_cores: number;
  storage_gb?: number;
  description?: string;
  notes?: string;
}

export interface IEmisVpsServiceCreatePayload {
  vps: string;
  name: string;
  port: number;
  service_type: string;
  domain: string;
  is_ssl_enabled: boolean;
  description?: string;
}

export interface IEmailResetRequestCreatePayload {
  full_name: string;
  roll_number: string;
  birth_date: string;
  primary_email: string;
  secondary_email: string;
  phone_number: string;
}
