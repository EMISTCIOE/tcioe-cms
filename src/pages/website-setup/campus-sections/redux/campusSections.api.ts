import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { ICampusSectionsCreatePayload, ICampusSectionsDetails, ICampusSectionsList, ICampusSectionsUpdatePayload } from './types';

export const campusSectionsAPI = 'cms/website-mod/campus-sections';

export const campusSectionsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusSections
    getCampusSections: builder.query<ICampusSectionsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusSectionsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusSections']
    }),

    // Retrieve CampusSections
    retrieveCampusSections: builder.query<ICampusSectionsDetails, number | null>({
      query: (id) => {
        return {
          url: `${campusSectionsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusSections']
    }),

    // Create CampusSections
    createCampusSections: builder.mutation<IMutationSuccessResponse, ICampusSectionsCreatePayload>({
      query: (values) => {
        const { members, thumbnail, heroImage, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append members
        if (members && members.length > 0) {
          members.forEach((member, index) => {
            if (member.photo instanceof File) {
              body.append(`members[${index}][photo]`, member.photo);
            }
            if (member.titlePrefix) {
              body.append(`members[${index}][titlePrefix]`, member.titlePrefix);
            }
            if (member.fullName) {
              body.append(`members[${index}][fullName]`, member.fullName);
            }
            if (member.designation) {
              body.append(`members[${index}][designation]`, member.designation);
            }
            if (member.email) {
              body.append(`members[${index}][email]`, member.email);
            }
            if (member.phoneNumber) {
              body.append(`members[${index}][phoneNumber]`, member.phoneNumber);
            }
            if (member.bio) {
              body.append(`members[${index}][bio]`, member.bio);
            }
            if (member.displayOrder !== undefined) {
              body.append(`members[${index}][displayOrder]`, String(member.displayOrder));
            }
            if (member.isActive !== undefined) {
              body.append(`members[${index}][isActive]`, String(member.isActive));
            }
          });
        }

        // Append thumbnail if it exists
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }
        if (heroImage instanceof File) {
          body.append('heroImage', heroImage);
        }

        return {
          url: `${campusSectionsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['CampusSections']
    }),

    // Patch CampusSections
    patchCampusSections: builder.mutation<IMutationSuccessResponse, { id: number; values: ICampusSectionsUpdatePayload }>({
      query: ({ id, values }) => {
        const { members, thumbnail, heroImage, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append members
        if (members && members.length > 0) {
          members.forEach((member, index) => {
            if (member.photo instanceof File) {
              body.append(`members[${index}][photo]`, member.photo);
            }
            if (member.id !== undefined) {
              body.append(`members[${index}][id]`, String(member.id));
            }
            if (member.fullName) {
              body.append(`members[${index}][fullName]`, member.fullName);
            }
            if (member.designation) {
              body.append(`members[${index}][designation]`, member.designation);
            }
            if (member.titlePrefix) {
              body.append(`members[${index}][titlePrefix]`, member.titlePrefix);
            }
            if (member.email) {
              body.append(`members[${index}][email]`, member.email);
            }
            if (member.phoneNumber) {
              body.append(`members[${index}][phoneNumber]`, member.phoneNumber);
            }
            if (member.bio) {
              body.append(`members[${index}][bio]`, member.bio);
            }
            if (member.displayOrder !== undefined) {
              body.append(`members[${index}][displayOrder]`, String(member.displayOrder));
            }
            if (member.isActive !== undefined) {
              body.append(`members[${index}][isActive]`, String(member.isActive));
            }
          });
        }

        // Append thumbnail if it exists
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }
        if (heroImage instanceof File) {
          body.append('heroImage', heroImage);
        }

        return {
          url: `${campusSectionsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusSections']
    }),

    // Delete CampusSections
    deleteCampusSections: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => {
        return {
          url: `${campusSectionsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusSections']
    }),
    deletCampusSectionsMember: builder.mutation<IMutationSuccessResponse, { id: number; member_id: number }>({
      query: ({ id, member_id }) => {
        return {
          url: `${campusSectionsAPI}/${id}/member/${member_id}`,
          method: 'DELETE'
        };
      }
      // invalidatesTags: ['CampusSections']
    })
  })
});

export const {
  useGetCampusSectionsQuery,
  useLazyGetCampusSectionsQuery,
  useRetrieveCampusSectionsQuery,
  useLazyRetrieveCampusSectionsQuery,
  useCreateCampusSectionsMutation,
  usePatchCampusSectionsMutation,
  useDeleteCampusSectionsMutation,
  useDeletCampusSectionsMemberMutation
} = campusSectionsAPISlice;
