export interface IPermission {
  id: string;
  name: string;
  codename: string;
}

export interface IRole {
  id: string;
  name: string;
  codename: string;
}

export interface IAuthState {
  id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  roles: IRole[] | [];
  isSuperuser: boolean;
  photo?: string;
  tokens?: {
    access: string;
    refresh: string;
  };
  permissions: IPermission[];
  isAuthenticated?: boolean;
  authVerificationEmailSent?: boolean;
  forgetPasswordEmailSent?: boolean;
  status?: string;
  message?: string;
  roleType?: string;
  roleDisplay?: string;
  designationTitle?: string;
  designationId?: string | null;
  departmentName?: string | null;
  departmentId?: string | null;
  clubName?: string | null;
  clubId?: string | null;
  unionName?: string | null;
  unionId?: string | null;
}

export interface UnverifiedLoginState {
  message: string;
}

export interface LoginFormDataType {
  persona: string;
  password: string;
  appContext?: string;
}

export interface LoginRequestPayload {
  persona: string;
  password: string;
  app_context?: string;
}

export interface ForgetPasswordRequestFormDataType {
  email: string;
}

export interface ResetPasswordRequestFormDataType {
  newPassword: string;
  confirmPassword: string;
  token?: string;
}
