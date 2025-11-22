import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosInstance, baseURL } from './axios';

const axiosBaseQuery =
  ({ URL } = { URL: '' }) =>
  async (args: any, api: any, extraOptions: any) => {
    const { url, method, data, body, params, headers, signal } = args;
    try {
      const result = await axiosInstance({
        url: URL + url,
        method,
        // Support both `data` (axios-style) and `body` (fetchBaseQuery-style)
        data: data ?? body,
        params,
        headers,
        cancelToken: signal
      });
      return { data: result.data };
    } catch (axiosError: any) {
      // If it's a refresh error, reset the API state and clear user session
      if (axiosError?.isRefreshError) {
        api.dispatch(rootAPI.util.resetApiState()); // Reset the API state (e.g., clear user data, reset auth)
      }

      return {
        error: {
          status: axiosError?.response?.status,
          data: axiosError?.response?.data || axiosError?.message
        }
      };
    }
  };

export const rootAPI = createApi({
  reducerPath: 'rootAPI',
  baseQuery: axiosBaseQuery({
    URL: baseURL
  }),
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
  tagTypes: [
    'BlogCategory',
    'User',
    'UserRole',
    'Account',
    'Notice',
    'CampusInfo',
    'CampusKeyOfficials',
    'CampusFeedbacks',
    'CampusEvents',
    'CampusUnions',
    'GlobalGallery',
    'CampusSections',
    'CampusUnits',
    'CampusReports',
    'AcademicCalendars',
    'AcademicDownloads',
    'CampusDownloads',
    'StudentClubs',
    'StudentClubEvents',
    'PhoneNumber',
    'Projects',
    'ProjectTags',
    'Research',
    'ResearchTag',
    'JournalArticle',
    'JournalAuthor',
    'AcademicProgram',
    'Subject',
    'Departments',
    'DashboardStats',
    'EmisHardware',
    'EmisVpsInfo',
    'EmisVpsService',
    'EmailResetRequest'
  ]
});
