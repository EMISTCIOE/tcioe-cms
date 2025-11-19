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
      query: (values) => {
        const { organizationChart, socialLinks, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append organizationChart if it's a File
        if (organizationChart instanceof File) {
          body.append('organizationChart', organizationChart);
        }

        // Append medias
        if (socialLinks && socialLinks.length > 0) {
          socialLinks.forEach((socialLink, index) => {
            // If id is defined, append it
            if (socialLink.id !== undefined) {
              body.append(`socialLinks[${index}][id]`, String(socialLink.id));
            }
            // platform
            if (socialLink.platform) {
              body.append(`socialLinks[${index}][platform]`, socialLink.platform);
            }
            // url
            if (socialLink.url) {
              body.append(`socialLinks[${index}][url]`, socialLink.url);
            }
            // isActive
            body.append(`socialLinks[${index}][isActive]`, String(socialLink?.isActive));
          });
        }

        return {
          url: campusInfoAPI,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusInfo']
    }),

    // Delete Social Link
    deleteSocialLink: builder.mutation<IMutationSuccessResponse, { id: string }>({
      query: ({ id }) => ({
        url: `${campusInfoAPI}/social-media-links/${id}/delete`,
        method: 'DELETE'
      }),
      invalidatesTags: ['CampusInfo']
    })
  })
});

export const { useGetCampusInfoQuery, useUpdateCampusInfoMutation, useDeleteSocialLinkMutation } = campusInfoAPISlice;
