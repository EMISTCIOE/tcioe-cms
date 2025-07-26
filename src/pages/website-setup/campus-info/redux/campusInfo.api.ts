import { IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { ICampusInfo, ICampusInfoUpdatePayload, ISocialLink } from './types';

export const campusInfoAPI = 'cms/website-mod/campus-info';

export const campusInfoAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Get Campus Info
    getCampusInfo: builder.query<ICampusInfo, void>({
      query: () => ({
        url: campusInfoAPI,
        method: 'GET'
      }),
      providesTags: ['CampusInfo']
    }),

    // Update Campus Info
    updateCampusInfo: builder.mutation<IMutationSuccessResponse, ICampusInfoUpdatePayload>({
      query: (values) => ({
        url: campusInfoAPI,
        method: 'PATCH',
        body: values
      }),
      invalidatesTags: ['CampusInfo']
    }),

    // Delete Social Link
    deleteSocialLink: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => ({
        url: `${campusInfoAPI}/social-media-links/${id}/delete`,
        method: 'DELETE'
      }),
      invalidatesTags: ['CampusInfo']
    })
  })
});

export const { useGetCampusInfoQuery, useUpdateCampusInfoMutation, useDeleteSocialLinkMutation } = campusInfoAPISlice;
