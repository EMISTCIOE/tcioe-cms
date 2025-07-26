import { rootAPI } from '@/libs/apiSlice';
import { ICampusInfoUpdatePayload } from './types';

export interface ICollegeInfoResponse {
  name: string;
  email: string;
  phone: string;
  location: string;
  organizationChart: string;
  socialLinks: Array<{
    uuid: string;
    platform: 'FACEBOOK' | 'TWITTER' | 'INSTAGRAM' | 'LINKEDIN' | 'YOUTUBE';
    url: string;
  }>;
}

const collegeInfoAPI = '/api/v1/cms/website-mod/campus-info';
const socialLinksAPI = `${collegeInfoAPI}/social-media-links`;

export const collegeInfoAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCollegeInfo: builder.query<ICollegeInfoResponse, void>({
      query: () => collegeInfoAPI,
      keepUnusedDataFor: 60,
      providesTags: ['CollegeInfo'] as const, // Add 'as const' for type safety
    }),

    updateCollegeInfo: builder.mutation<ICollegeInfoResponse, Partial<ICampusInfoUpdatePayload>>({
      query: (payload) => {
        const formData = new FormData();
        
        if (payload.name) formData.append('name', payload.name);
        if (payload.phone) formData.append('phoneNumber', payload.phone);
        if (payload.email) formData.append('email', payload.email);
        if (payload.location) formData.append('location', payload.location);
        if (payload.organizationChart) {
          formData.append('organizationChart', payload.organizationChart);
        }
        if (payload.socialLinks) {
          formData.append('socialLinks', JSON.stringify(payload.socialLinks));
        }

        return {
          url: collegeInfoAPI,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['CollegeInfo'] as const,
    }),

    deleteSocialLink: builder.mutation<void, string>({
      query: (uuid) => ({
        url: `${socialLinksAPI}/${uuid}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CollegeInfo'] as const,
    }),
  }),
});

export const {
  useGetCollegeInfoQuery,
  useUpdateCollegeInfoMutation,
  useDeleteSocialLinkMutation,
} = collegeInfoAPISlice;