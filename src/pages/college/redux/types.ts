export interface ICampusInfoUpdatePayload {
  name: string;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  organizationChart?: File | null;
  socialLinks?: {
    platform: 'FACEBOOK' | 'TWITTER' | 'INSTAGRAM' | 'LINKEDIN' | 'YOUTUBE';
    url: string;
  }[] | null;
}