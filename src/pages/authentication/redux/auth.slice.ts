import Cookies from 'js-cookie';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { IAuthState } from './types';

const initialState: IAuthState = {
  id: -1,
  fullName: '',
  email: '',
  phoneNo: '',
  isEmailVerified: false,
  isPhoneVerified: false,
  roles: [],
  photo: '',
  permissions: [],
  isSuperuser: false,
  isAuthenticated: false,
  authVerificationEmailSent: false,
  forgetPasswordEmailSent: false,
  status: undefined,
  message: undefined,
  tokens: undefined,
  roleType: undefined,
  roleDisplay: undefined,
  designationTitle: undefined,
  designationId: null,
  departmentName: undefined,
  departmentId: null,
  clubName: undefined,
  clubId: null,
  unionName: undefined,
  unionId: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<IAuthState>) => {
      const {
        payload: {
          fullName,
          email,
          photo,
          phoneNo,
          tokens,
          isEmailVerified,
          isPhoneVerified,
          isSuperuser,
          roles,
          permissions,
          status,
          message,
          roleType,
          roleDisplay,
          designationTitle,
          designationId,
          departmentName,
          departmentId,
          clubName,
          clubId,
          unionName,
          unionId
        }
      } = action;

      state.fullName = fullName;
      state.email = email;
      state.photo = photo;
      state.phoneNo = phoneNo;
      state.isEmailVerified = isEmailVerified;
      state.isPhoneVerified = isPhoneVerified;
      state.isSuperuser = isSuperuser;
      state.roles = roles;
      state.permissions = permissions;
      state.tokens = tokens;
      state.status = status;
      state.message = message;
      state.isAuthenticated = true;
      state.roleType = roleType;
      state.roleDisplay = roleDisplay;
      state.designationTitle = designationTitle;
      state.designationId = designationId;
      state.departmentName = departmentName;
      state.departmentId = departmentId;
      state.clubName = clubName;
      state.clubId = clubId;
      state.unionName = unionName;
      state.unionId = unionId;
      // Save access and refresh tokens in the cookies
      Cookies.set('access', tokens?.access as string, {
        path: '/',
        secure: true,
        sameSite: 'Lax'
      });
      Cookies.set('refresh', tokens?.refresh as string, {
        path: '/',
        secure: true,
        sameSite: 'Lax'
      });
      Cookies.set('logout', 'false');
    },
    logoutSuccess: (state) => {
      Cookies.remove('access', { path: '/' });
      Cookies.remove('refresh', { path: '/' });
      Cookies.set('logout', 'true');
      // Reset the state to initialState
      return initialState;
    },
    checkAuthStatus: (state) => {
      const accessToken = Cookies.get('access');
      const logoutFlag = Cookies.get('logout');

      if (!accessToken || logoutFlag === 'true') {
        // No valid token, reset authentication state
        return initialState;
      }

      // Keep the current state if token exists
      return state;
    },
    setAuthVerificationEmailSent: (state) => {
      state.authVerificationEmailSent = !state.authVerificationEmailSent;
    },
    setForgetPasswordEmailSent: (state) => {
      state.forgetPasswordEmailSent = !state.forgetPasswordEmailSent;
    }
  }
});

export const { loginSuccess, logoutSuccess, checkAuthStatus, setAuthVerificationEmailSent, setForgetPasswordEmailSent } = authSlice.actions;

export default authSlice.reducer;
