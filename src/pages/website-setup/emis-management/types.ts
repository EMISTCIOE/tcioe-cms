export type HardwareTypeOption =
  | 'router'
  | 'switch'
  | 'server'
  | 'firewall'
  | 'endpoint'
  | 'storage'
  | 'ups'
  | 'printer'
  | 'telephone'
  | 'projector'
  | 'camera'
  | 'scanner'
  | 'monitor'
  | 'laptop'
  | 'desktop'
  | 'tablet'
  | 'mobile'
  | 'access_point'
  | 'modem'
  | 'repeater'
  | 'bridge'
  | 'gateway'
  | 'load_balancer'
  | 'nas'
  | 'san'
  | 'rack'
  | 'pdu'
  | 'kvm'
  | 'other';
export type EnvironmentOption = 'production' | 'staging' | 'development' | 'lab';
export type ProviderOption = 'digitalocean' | 'lightsail' | 'hetzner' | 'on-prem' | 'other';
export type NodeStatusOption = 'active' | 'maintenance' | 'retired' | 'decommissioned';
export type HealthStatusOption = 'healthy' | 'degraded' | 'outage' | 'unknown';
export type ServiceStatusOption = 'running' | 'paused' | 'failed' | 'deploying';
export type ServiceProtocolOption = 'http' | 'https' | 'tcp' | 'udp';
export type DeployStrategyOption = 'manual' | 'gitops' | 'ci_cd';
export type HardwareStatusOption = 'operational' | 'standby' | 'maintenance' | 'retired';
export type RequestStatusType = 'pending' | 'approved' | 'rejected';

export interface IEmisHardware {
  id: string;
  name: string;
  asset_tag: string;
  hardware_type: HardwareTypeOption;
  manufacturer?: string;
  model_number?: string;
  serial_number?: string;
  ip_address?: string;
  location?: string;
  environment: EnvironmentOption;
  status: HardwareStatusOption;
  responsible_team?: string;
  purchase_date?: string;
  warranty_expires_at?: string;
  power_draw_watts?: number;
  rack_unit?: string;
  thumbnail_image?: string;
  description?: string;
  specifications?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  endpoints?: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface IEmisVpsInfo {
  id: string;
  vps_name: string;
  slug: string;
  provider: ProviderOption;
  environment: EnvironmentOption;
  status: NodeStatusOption;
  health_status: HealthStatusOption;
  ip_address: string;
  private_ip_address?: string;
  location: string;
  ram_gb: number;
  cpu_cores: number;
  storage_gb?: number;
  storage_type?: string;
  bandwidth_tb?: number;
  ssh_port: number;
  operating_system?: string;
  kernel_version?: string;
  monitoring_url?: string;
  last_health_check_at?: string;
  tags?: string[];
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
  service_key: string;
  port: number;
  protocol: ServiceProtocolOption;
  service_type: string;
  domain: string;
  is_ssl_enabled: boolean;
  healthcheck_endpoint?: string;
  healthcheck_expectation?: string;
  version?: string;
  deploy_strategy: DeployStrategyOption;
  auto_restart: boolean;
  maintained_by?: string;
  status: ServiceStatusOption;
  last_deployed_at?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface IEmailResetRequest {
  id: string;
  fullName: string;
  rollNumber: string;
  birthDate: string;
  primaryEmail: string;
  secondaryEmail: string;
  phoneNumber: string;
  status: RequestStatusType;
  requestSequence: number;
  requestsRemaining: number;
  processedAt?: string;
  processedBy?: string;
  processedByName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEmisHardwareCreatePayload {
  name: string;
  asset_tag?: string;
  hardware_type: HardwareTypeOption;
  manufacturer?: string;
  model_number?: string;
  serial_number?: string;
  ip_address?: string;
  location?: string;
  environment: EnvironmentOption;
  status: HardwareStatusOption;
  responsible_team?: string;
  purchase_date?: string;
  warranty_expires_at?: string;
  power_draw_watts?: number;
  rack_unit?: string;
  specifications?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  endpoints?: string[];
  description?: string;
  thumbnail_image?: File | null;
}

export interface IEmisVpsInfoCreatePayload {
  vps_name: string;
  provider: ProviderOption;
  environment: EnvironmentOption;
  status: NodeStatusOption;
  health_status?: HealthStatusOption;
  ip_address: string;
  private_ip_address?: string;
  location: string;
  ram_gb: number;
  cpu_cores: number;
  storage_gb?: number;
  storage_type?: string;
  bandwidth_tb?: number;
  ssh_port: number;
  operating_system?: string;
  kernel_version?: string;
  monitoring_url?: string;
  tags?: string[];
  description?: string;
  notes?: string;
}

export interface IEmisVpsServiceCreatePayload {
  vps: string;
  name: string;
  service_key: string;
  port: number;
  protocol: ServiceProtocolOption;
  service_type: string;
  domain: string;
  is_ssl_enabled: boolean;
  healthcheck_endpoint?: string;
  healthcheck_expectation?: string;
  version?: string;
  deploy_strategy: DeployStrategyOption;
  auto_restart: boolean;
  maintained_by?: string;
  status?: ServiceStatusOption;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface IEmailResetRequestCreatePayload {
  full_name: string;
  roll_number: string;
  birth_date: string;
  primary_email: string;
  secondary_email: string;
  phone_number: string;
}

export type EmisDownloadCategoryOption = 'report_form' | 'resource';

export interface IEmisDownload {
  id: string;
  uuid: string;
  title: string;
  description?: string;
  category: EmisDownloadCategoryOption;
  file?: string | null;
  link_url?: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface IEmisDownloadPayload {
  title: string;
  description?: string;
  category: EmisDownloadCategoryOption;
  link_url?: string;
  file?: File | null;
}

export type EmisNoticeCategoryOption = 'security' | 'maintenance' | 'release' | 'advisory' | 'general';
export type EmisNoticeSeverityOption = 'info' | 'minor' | 'major' | 'critical';

export interface IEmisNotice {
  id: string;
  uuid: string;
  slug: string;
  title: string;
  summary?: string;
  body?: string;
  category: EmisNoticeCategoryOption;
  severity: EmisNoticeSeverityOption;
  published_at: string;
  is_published: boolean;
  attachment?: string | null;
  external_url?: string | null;
  views: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface IEmisNoticePayload {
  title: string;
  summary?: string;
  body?: string;
  category: EmisNoticeCategoryOption;
  severity: EmisNoticeSeverityOption;
  published_at?: string;
  is_published?: boolean;
  attachment?: File | null;
  external_url?: string;
}
