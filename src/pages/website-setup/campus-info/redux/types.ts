export enum SocialPlatform {
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  LINKEDIN = 'LINKEDIN',
  YOUTUBE = 'YOUTUBE',
  GITHUB = 'GITHUB',
  OTHER = 'OTHER'
}

export interface ISocialLink {
  id?: number;
  platform: SocialPlatform;
  url: string;
  isActive: boolean;
}

export interface ICampusInfo {
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  organizationChart: string | File | null;
  socialLinks: ISocialLink[];
}

export interface ICampusInfoUpdatePayload extends Partial<ICampusInfo> {}
